import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import compression from 'compression';
import { AppModule } from './app.module';
import { CacheControlInterceptor } from './common/interceptors/cache-control.interceptor';

let cachedApp: any;
let appPromise: Promise<any> | null = null;

async function createApp() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug'],
  });

  app.setGlobalPrefix('api');

  // Gzip/Brotli compression — reduces payload size by ~70%
  app.use(compression({
    threshold: 1024, // Only compress responses > 1KB
    level: 6,        // Balanced speed/compression
  }));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Cache-Control interceptor for Vercel edge caching
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new CacheControlInterceptor(reflector));

  await app.init();
  return app;
}

// Vercel serverless handler (default export)
// Uses singleton promise pattern to avoid race conditions on concurrent cold starts
export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    if (!appPromise) {
      appPromise = createApp();
    }
    cachedApp = await appPromise;
  }
  const expressApp = cachedApp.getHttpAdapter().getInstance();
  return expressApp(req, res);
}

// Health/warm-up endpoint (ultra-lightweight, no NestJS overhead)
export async function warmup(_req: any, res: any) {
  res.status(200).json({ ok: true, ts: Date.now() });
}

// Local development
if (process.env.NODE_ENV !== 'production') {
  createApp().then(async (app) => {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Codespace API running on http://localhost:${port}/api`);
  });
}
