import express from 'express';
import { env } from './config/env';
import { createApiRouter } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { MatchmakingService } from './services/matchmaking.service';

export function createApp(matchmakingService: MatchmakingService) {
  const app = express();

  // Bulletproof Custom CORS Middleware for cross-origin requests & preflight OPTIONS
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API V1 routes
  app.use('/api/v1', createApiRouter(matchmakingService));

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
