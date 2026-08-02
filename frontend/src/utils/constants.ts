const isBrowser = typeof window !== 'undefined';
const isProdHost = isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

const RENDER_BACKEND_URL = 'https://fluxchat-hsqk.onrender.com';

export const API_URL = process.env.NEXT_PUBLIC_API_URL 
  || (isProdHost ? `${RENDER_BACKEND_URL}/api/v1` : 'http://localhost:4000/api/v1');

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL 
  || (isProdHost ? RENDER_BACKEND_URL : 'http://localhost:4000');

export const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};
