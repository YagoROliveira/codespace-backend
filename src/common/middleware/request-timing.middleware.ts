import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Logs request duration for every API call.
 * In production, only logs slow requests (>500ms).
 * In development, logs all requests.
 */
@Injectable()
export class RequestTimingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  private readonly SLOW_THRESHOLD_MS = 500;

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      if (process.env.NODE_ENV === 'production') {
        // In production, only log slow requests
        if (duration >= this.SLOW_THRESHOLD_MS) {
          this.logger.warn(
            `SLOW ${method} ${originalUrl} ${statusCode} — ${duration}ms`,
          );
        }
      } else {
        // In dev, log everything with color coding
        const logFn = duration > this.SLOW_THRESHOLD_MS ? this.logger.warn.bind(this.logger)
          : duration > 200 ? this.logger.log.bind(this.logger)
          : this.logger.debug.bind(this.logger);
        logFn(`${method} ${originalUrl} ${statusCode} — ${duration}ms`);
      }
    });

    next();
  }
}
