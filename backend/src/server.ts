import http from 'http';
import { Server } from 'socket.io';
import { execSync } from 'child_process';
import path from 'path';
import { env } from './config/env';
import { createApp } from './app';
import { MatchmakingService } from './services/matchmaking.service';
import { setupSocketManager } from './sockets/socket.manager';
import { logger } from './utils/logger';

async function bootstrap() {
  // Sync SQLite schema on boot to ensure dev.db tables are ready
  try {
    const schemaPath = path.resolve(__dirname, '../../database/prisma/schema.prisma');
    execSync(`npx prisma db push --schema="${schemaPath}"`, { stdio: 'ignore' });
    logger.info('✅ SQLite Database synced on startup');
  } catch (err: any) {
    logger.warn(`Database sync warning: ${err.message}`);
  }

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
