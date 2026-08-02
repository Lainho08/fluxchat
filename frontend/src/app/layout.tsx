import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { SocketProvider } from '../contexts/SocketContext';
import { WebRTCProvider } from '../contexts/WebRTCContext';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fluxchat.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FluxChat | Chat Anônimo de Vídeo, Voz e Texto em Tempo Real',
    template: '%s | FluxChat',
  },
  description:
    'Conecte-se instantaneamente a desconhecidos no mundo todo por vídeo, voz ou texto. Pareamento ultrarrápido, anônimo, seguro e com filtro de gênero e interesses.',
  keywords: [
    'chat anônimo',
    'omegle clone',
    'omegle brasil',
    'bate papo online',
    'videochat gratis',
    'conversar com estranhos',
    'chat aleatorio',
    'pareamento por genero',
    'fluxchat',
    'chat em tempo real',
    'webrtc chat',
  ],
  authors: [{ name: 'FluxChat' }],
  creator: 'FluxChat',
  publisher: 'FluxChat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    title: 'FluxChat | Chat Anônimo de Vídeo, Voz e Texto em Tempo Real',
    description:
      'Conecte-se instantaneamente a pessoas do mundo todo por vídeo, voz e texto. Sem necessidade de cadastro, 100% anônimo e seguro.',
    siteName: 'FluxChat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FluxChat | Chat Anônimo por Vídeo, Voz e Texto',
    description:
      'Conecte-se instantaneamente a pessoas do mundo todo com filtros de interesse e gênero.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'FluxChat',
  url: siteUrl,
  description:
    'Plataforma de comunicação P2P anônima em tempo real via vídeo, voz e texto.',
  applicationCategory: 'SocialNetworkingApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
