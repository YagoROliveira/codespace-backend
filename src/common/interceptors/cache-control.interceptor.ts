import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';

export const CACHE_TTL_KEY = 'cache-control-ttl';

/**
 * Decorator to set Cache-Control headers on specific endpoints.
 * @param maxAge - browser cache in seconds
 * @param sMaxAge - CDN/edge cache in seconds (Vercel)
 * @param staleWhileRevalidate - serve stale while revalidating
 */
export const CacheTTL = (maxAge: number, sMaxAge?: number, staleWhileRevalidate?: number) =>
  SetMetadata(CACHE_TTL_KEY, { maxAge, sMaxAge, staleWhileRevalidate });

/**
 * Preset decorators for common cache patterns
 */
export const CacheStatic = () => CacheTTL(300, 600, 3600);       // 5min browser, 10min CDN, 1h stale
export const CacheSemiStatic = () => CacheTTL(60, 120, 300);      // 1min browser, 2min CDN, 5min stale
export const CacheShort = () => CacheTTL(10, 30, 60);             // 10s browser, 30s CDN, 1min stale
export const NoCache = () => CacheTTL(0);                         // no cache

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const ttl = this.reflector.get<{
          maxAge: number;
          sMaxAge?: number;
          staleWhileRevalidate?: number;
        }>(CACHE_TTL_KEY, context.getHandler());

        if (!ttl) return;

        const response = context.switchToHttp().getResponse<Response>();
        if (!response.headersSent) {
          if (ttl.maxAge === 0) {
            response.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          } else {
            const parts = [`public`, `max-age=${ttl.maxAge}`];
            if (ttl.sMaxAge !== undefined) parts.push(`s-maxage=${ttl.sMaxAge}`);
            if (ttl.staleWhileRevalidate !== undefined) parts.push(`stale-while-revalidate=${ttl.staleWhileRevalidate}`);
            response.setHeader('Cache-Control', parts.join(', '));
          }
        }
      }),
    );
  }
}
