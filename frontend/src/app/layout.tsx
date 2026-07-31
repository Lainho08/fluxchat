import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import { WebRTCProvider } from '../contexts/WebRTCContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OmegleNext - Plataforma de Chat Anônimo em Tempo Real',
  description: 'Conecte-se instantaneamente a pessoas ao redor do mundo por texto, voz e vídeo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <WebRTCProvider>{children}</WebRTCProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
