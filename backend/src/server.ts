import http from 'http';
import { Server } from 'socket.io';
import { env } from './config/env';
import { createApp } from './app';
import { MatchmakingService } from './services/matchmaking.service';
import { setupSocketManager } from './sockets/socket.manager';
import { logger } from './utils/logger';

async function bootstrap() {
  const matchmakingService = new MatchmakingService();
  const app = createApp(matchmakingService);
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Attach io to express app instance for controller access
  app.set('io', io);

  // Initialize Socket.IO engine handlers
  setupSocketManager(io, matchmakingService);

  const PORT = parseInt(env.PORT, 10);
  server.listen(PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    logger.info(`📡 Socket.IO signaling server active`);
  });
}

bootstrap().catch((err) => {
  logger.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
