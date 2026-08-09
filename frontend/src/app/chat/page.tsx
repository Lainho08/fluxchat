'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSocket } from '../../contexts/SocketContext';
import { useWebRTC } from '../../contexts/WebRTCContext';
import { Header } from '../../components/home/Header';
import { VideoChat } from '../../components/chat/VideoChat';
import { TextChat } from '../../components/chat/TextChat';
import { MediaControls } from '../../components/chat/MediaControls';
import { ChatMessage, ChatMode, Gender, PartnerGenderPreference } from '../../types';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode: ChatMode = (searchParams.get('mode')?.toUpperCase() as ChatMode) || 'VIDEO';
  const partnerGender = (searchParams.get('partnerGender')?.toUpperCase() as PartnerGenderPreference) || 'BOTH';
  const myGender = (searchParams.get('myGender')?.toUpperCase() as Gender) || 'UNSPECIFIED';
  const rawInterests = searchParams.get('interests') || '';
  const interests = rawInterests ? rawInterests.split(',') : [];
  const countryPreference = searchParams.get('countryPreference') || 'ANY';

  const { socket, isConnected } = useSocket();
  const { startLocalMedia, stopLocalMedia, initiatePeerConnection, closePeerConnection } = useWebRTC();

  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [partnerCountry, setPartnerCountry] = useState<string | null>(null);
  const [partnerFlag, setPartnerFlag] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  // Start matchmaking loop
  const findPartner = useCallback(() => {
    if (!socket) return;

    closePeerConnection();
    setPartnerName(null);
    setMessages([]);
    setIsSearching(true);
    setIsPartnerTyping(false);

    socket.emit('findPartner', { mode, interests, partnerGender, myGender, countryPreference });
  }, [socket, mode, partnerGender, myGender, rawInterests, closePeerConnection]);

  // Initialize media devices for video/audio mode
  useEffect(() => {
    if (mode !== 'TEXT') {
      startLocalMedia(mode === 'VIDEO', true);
    }
    return () => {
      stopLocalMedia();
      closePeerConnection();
    };
  }, [mode]);

  // Connect socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Auto-trigger search when page loads or socket connects
    findPartner();

    const handlePartnerFound = async (data: {
      roomId: string;
      partnerId: string;
      partnerName: string;
      partnerCountry: string | null;
      partnerCountryCode: string | null;
      partnerFlag: string | null;
      isInitiator: boolean;
    }) => {
      setPartnerName(data.partnerName);
      setPartnerCountry(data.partnerCountry);
      setPartnerFlag(data.partnerFlag);
      setIsSearching(false);
      setMessages([]);

      if (mode !== 'TEXT') {
        await initiatePeerConnection(data.isInitiator);
      }
    };

    const handlePartnerLeft = () => {
      closePeerConnection();
      setPartnerName(null);
      setPartnerCountry(null);
      setPartnerFlag(null);
      setIsSearching(true);
      findPartner();
    };

    const handleReceiveMessage = (data: {
      senderId: string;
      senderName: string;
      text: string;
      timestamp: string;
    }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: data.timestamp,
          isSelf: false,
        },
      ]);
    };

    const handleTyping = () => setIsPartnerTyping(true);
    const handleStopTyping = () => setIsPartnerTyping(false);

    socket.on('partnerFound', handlePartnerFound);
    socket.on('partnerLeft', handlePartnerLeft);
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);

    return () => {
      socket.off('partnerFound', handlePartnerFound);
      socket.off('partnerLeft', handlePartnerLeft);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
    };
  }, [socket, isConnected, mode, findPartner, initiatePeerConnection, closePeerConnection]);

  // Keyboard shortcut: ESC to skip partner
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [socket]);

  const handleSendMessage = (text: string) => {
    if (!socket || !partnerName) return;

    socket.emit('sendMessage', { text });

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        senderId: 'me',
        senderName: 'Você',
        text,
        timestamp: new Date().toISOString(),
        isSelf: true,
      },
    ]);
  };

  const handleSkip = () => {
    if (socket) {
      socket.emit('skipPartner');
      findPartner();
    }
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit('leaveRoom');
    }
    stopLocalMedia();
    closePeerConnection();
    router.push('/');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Side Video/Audio Frame or Full Text Chat */}
        {mode !== 'TEXT' ? (
          <div className="w-full md:w-3/5 lg:w-2/3 h-1/2 md:h-full bg-slate-950">
            <VideoChat partnerName={partnerName} partnerFlag={partnerFlag} partnerCountry={partnerCountry} isSearching={isSearching} mode={mode} />
          </div>
        ) : null}

        {/* Right Side Text Chat Component */}
        <div className={`w-full ${mode !== 'TEXT' ? 'md:w-2/5 lg:w-1/3 h-1/2 md:h-full' : 'h-full'}`}>
          <TextChat
            messages={messages}
            onSendMessage={handleSendMessage}
            isPartnerTyping={isPartnerTyping}
            isConnectedPartner={!!partnerName}
            partnerName={partnerName}
            partnerFlag={partnerFlag}
            partnerCountry={partnerCountry}
          />
        </div>
      </div>

      {/* Bottom Media & Control Bar */}
      <MediaControls onSkip={handleSkip} onLeave={handleLeave} mode={mode} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span>Carregando sala de chat...</span>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
