const RENDER_BACKEND_URL = 'https://fluxchat-hsqk.onrender.com';

export function getApiUrl(): string {
  // If explicitly set via env var, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In the browser: use the Next.js proxy (/api/v1 → Render via rewrite)
  // This avoids CORS issues and works on both localhost and Vercel
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  // SSR fallback
  return 'http://localhost:4000/api/v1';
}

export function getSocketUrl(): string {
  // If explicitly set via env var, use it
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    // In production: connect socket DIRECTLY to Render backend.
    // Vercel rewrites do NOT support WebSocket protocol upgrades.
    return isLocal ? 'http://localhost:4000' : RENDER_BACKEND_URL;
  }
  return 'http://localhost:4000';
}

export const API_URL = getApiUrl();
export const SOCKET_URL = getSocketUrl();


export const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};
