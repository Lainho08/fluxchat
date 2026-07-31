import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types';
import { verifyToken } from '../utils/jwt';
import { MatchmakingService } from '../services/matchmaking.service';
import { registerMatchHandlers, handlePartnerLeave } from './match.handler';
import { registerChatHandlers } from './chat.handler';
import { registerWebRTCHandlers } from './webrtc.handler';
import { logger } from '../utils/logger';

export function setupSocketManager(io: Server, matchmakingService: MatchmakingService) {
  // Socket Middleware for optional auth
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (token) {
      try {
        const payload = verifyToken(token);
        socket.user = payload;
      } catch (err) {
        // Fall back to guest socket
      }
    }
    next();
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`⚡ Socket Connected: ${socket.id} (User: ${socket.user?.username || 'Guest'})`);

    registerMatchHandlers(io, socket, matchmakingService);
    registerChatHandlers(io, socket);
    registerWebRTCHandlers(io, socket);

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket Disconnected: ${socket.id}`);
      handlePartnerLeave(io, socket, matchmakingService);
    });
  });
}
