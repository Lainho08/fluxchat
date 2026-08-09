/** @type {import('next').NextConfig} */

// Priority: env var → production Render URL → localhost
const BACKEND_URL =
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://fluxchat-hsqk.onrender.com'
    : 'http://localhost:4000');

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
      {
        // Socket.IO polling fallback only — WS connects directly to Render
        source: '/socket.io/:path*',
        destination: `${BACKEND_URL}/socket.io/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/v1/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

