import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types';

export function registerWebRTCHandlers(io: Server, socket: AuthenticatedSocket) {
  // Event: videoOffer (SDP offer)
  socket.on('videoOffer', (data: { offer: any }) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('videoOffer', {
        offer: data.offer,
        senderId: socket.id,
      });
    }
  });

  // Event: videoAnswer (SDP answer)
  socket.on('videoAnswer', (data: { answer: any }) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('videoAnswer', {
        answer: data.answer,
        senderId: socket.id,
      });
    }
  });

  // Event: iceCandidate
  socket.on('iceCandidate', (data: { candidate: any }) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('iceCandidate', {
        candidate: data.candidate,
        senderId: socket.id,
      });
    }
  });
}
