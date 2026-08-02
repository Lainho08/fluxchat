import { Server } from 'socket.io';
import { AuthenticatedSocket, ChatMode, Gender, PartnerGenderPreference } from '../types';
import { MatchmakingService } from '../services/matchmaking.service';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export function registerMatchHandlers(
  io: Server,
  socket: AuthenticatedSocket,
  matchmakingService: MatchmakingService
) {
  // Event: findPartner
  socket.on('findPartner', async (data: {
    mode?: ChatMode;
    interests?: string[];
    gender?: Gender;
    myGender?: Gender;
    genderPreference?: PartnerGenderPreference;
    partnerGender?: PartnerGenderPreference;
  }) => {
    const mode: ChatMode = data.mode || 'TEXT';
    const interests: string[] = data.interests || [];
    const gender: Gender = data.gender || data.myGender || 'UNSPECIFIED';
    const genderPreference: PartnerGenderPreference = data.genderPreference || data.partnerGender || 'BOTH';

    socket.mode = mode;
    socket.interests = interests;
    socket.gender = gender;
    socket.genderPreference = genderPreference;

    const candidate = {
      socketId: socket.id,
      userId: socket.user?.userId || `guest_${socket.id}`,
      username: socket.user?.username || 'Estranho',
      mode,
      interests,
      gender,
      genderPreference,
      joinedAt: Date.now(),
    };

    const partner = await matchmakingService.addToQueue(candidate);

    if (partner) {
      const roomId = `room:${uuidv4()}`;

      socket.roomId = roomId;
      socket.join(roomId);

      const partnerSocket = io.sockets.sockets.get(partner.socketId) as AuthenticatedSocket | undefined;
      if (partnerSocket) {
        partnerSocket.roomId = roomId;
        partnerSocket.join(roomId);

        // Register room state
        matchmakingService.registerRoom(roomId, candidate, partner, mode);

        // Emit partnerFound event to both
        // First socket gets isInitiator = true (for WebRTC offer)
        socket.emit('partnerFound', {
          roomId,
          partnerId: partner.userId,
          partnerName: partner.username,
          isInitiator: true,
          mode,
        });

        partnerSocket.emit('partnerFound', {
          roomId,
          partnerId: candidate.userId,
          partnerName: candidate.username,
          isInitiator: false,
          mode,
        });

        logger.info(`Match created in room ${roomId} between ${socket.id} & ${partner.socketId}`);
      }
    } else {
      socket.emit('waitingForPartner', { message: 'Procurando alguém para você conversar...' });
    }
  });

  // Event: skipPartner / leaveRoom
  socket.on('skipPartner', () => {
    handlePartnerLeave(io, socket, matchmakingService);
  });

  socket.on('leaveRoom', () => {
    handlePartnerLeave(io, socket, matchmakingService);
  });
}

export function handlePartnerLeave(
  io: Server,
  socket: AuthenticatedSocket,
  matchmakingService: MatchmakingService
) {
  matchmakingService.removeFromQueue(socket.id);

  if (socket.roomId) {
    const roomId = socket.roomId;
    matchmakingService.closeRoom(roomId);

    // Notify other room occupants
    socket.to(roomId).emit('partnerLeft', { message: 'O seu parceiro saiu da conversa.' });
    socket.leave(roomId);
    socket.roomId = undefined;
  }
}
