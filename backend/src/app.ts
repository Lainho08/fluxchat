import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { createApiRouter } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { MatchmakingService } from './services/matchmaking.service';

export function createApp(matchmakingService: MatchmakingService) {
  const app = express();

  app.use(cors({
    origin: true,
    credentials: true,
  }));

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
