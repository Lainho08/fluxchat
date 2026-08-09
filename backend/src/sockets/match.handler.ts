import { Server } from 'socket.io';
import { AuthenticatedSocket, ChatMode, Gender, PartnerGenderPreference } from '../types';
import { MatchmakingService } from '../services/matchmaking.service';
import { detectCountryFromIp, countryCodeToFlag } from '../services/geo.service';
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
    countryPreference?: string; // ISO code, ex: "BR", or "ANY"
  }) => {
    const mode: ChatMode = data.mode || 'TEXT';
    const interests: string[] = data.interests || [];
    const gender: Gender = data.gender || data.myGender || 'UNSPECIFIED';
    const genderPreference: PartnerGenderPreference = data.genderPreference || data.partnerGender || 'BOTH';
    const countryPreference: string = data.countryPreference || 'ANY';

    socket.mode = mode;
    socket.interests = interests;
    socket.gender = gender;
    socket.genderPreference = genderPreference;
    socket.countryPreference = countryPreference;

    // Detect country from IP (cached after first lookup)
    if (!socket.country) {
      const ip = socket.handshake.headers['x-forwarded-for']?.toString().split(',')[0].trim()
        || socket.handshake.address;
      const geo = await detectCountryFromIp(ip);
      if (geo) {
        socket.country = geo.country;
        socket.countryCode = geo.countryCode;
      }
    }

    const candidate = {
      socketId: socket.id,
      userId: socket.user?.userId || `guest_${socket.id}`,
      username: socket.user?.username || 'Estranho',
      mode,
      interests,
      gender,
      genderPreference,
      country: socket.country,
      countryCode: socket.countryCode,
      countryPreference: countryPreference === 'ANY' ? undefined : countryPreference,
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

        matchmakingService.registerRoom(roomId, candidate, partner, mode);

        // Build geo display info for each user
        const candidateFlag = candidate.countryCode ? countryCodeToFlag(candidate.countryCode) : '🌍';
        const partnerFlag = partner.countryCode ? countryCodeToFlag(partner.countryCode) : '🌍';

        // Emit partnerFound to the new socket (candidate)
        socket.emit('partnerFound', {
          roomId,
          partnerId: partner.userId,
          partnerName: partner.username,
          partnerCountry: partner.country || null,
          partnerCountryCode: partner.countryCode || null,
          partnerFlag: partnerFlag,
          isInitiator: true,
          mode,
        });

        // Emit partnerFound to the waiting socket (partner)
        partnerSocket.emit('partnerFound', {
          roomId,
          partnerId: candidate.userId,
          partnerName: candidate.username,
          partnerCountry: candidate.country || null,
          partnerCountryCode: candidate.countryCode || null,
          partnerFlag: candidateFlag,
          isInitiator: false,
          mode,
        });

        logger.info(
          `Match created in room ${roomId} between ` +
          `${socket.id} (${candidate.countryCode || '??'}) & ${partner.socketId} (${partner.countryCode || '??'})`
        );
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

    socket.to(roomId).emit('partnerLeft', { message: 'O seu parceiro saiu da conversa.' });
    socket.leave(roomId);
    socket.roomId = undefined;
  }
}
