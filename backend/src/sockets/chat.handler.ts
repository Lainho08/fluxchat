import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../types';

export function registerChatHandlers(io: Server, socket: AuthenticatedSocket) {
  // Event: sendMessage
  socket.on('sendMessage', (data: { text: string }) => {
    if (!socket.roomId) return;

    if (!data.text || !data.text.trim()) return;

    const messagePayload = {
      senderId: socket.user?.userId || socket.id,
      senderName: socket.user?.username || 'Você',
      text: data.text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Emit to partner in room
    socket.to(socket.roomId).emit('receiveMessage', messagePayload);
  });

  // Event: typing
  socket.on('typing', () => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('typing', { userId: socket.id });
    }
  });

  // Event: stopTyping
  socket.on('stopTyping', () => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('stopTyping', { userId: socket.id });
    }
  });
}
