'use client';

import React, { useEffect, useRef } from 'react';
import { User, VideoOff, MicOff, Loader2 } from 'lucide-react';
import { useWebRTC } from '../../contexts/WebRTCContext';

interface VideoChatProps {
  partnerName: string | null;
  partnerFlag?: string | null;
  partnerCountry?: string | null;
  isSearching: boolean;
  mode: 'VIDEO' | 'AUDIO';
}

export const VideoChat: React.FC<VideoChatProps> = ({ partnerName, partnerFlag, partnerCountry, isSearching, mode }) => {
  const { localStream, remoteStream, isVideoMuted, isAudioMuted } = useWebRTC();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Attach local stream to video tag
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to video tag
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col md:flex-row items-center justify-center overflow-hidden p-2 gap-2">
      {/* Remote Video Container */}
      <div className="relative flex-1 w-full h-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-400 p-6 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            <p className="text-sm font-semibold">Procurando um parceiro para você...</p>
            <p className="text-xs text-slate-500">Isso leva apenas alguns segundos</p>
          </div>
        ) : partnerName ? (
          <>
            {mode === 'VIDEO' ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-slate-300">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-sky-500/20 animate-pulse">
                  {partnerName.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-bold">{partnerName}</span>
                <span className="text-xs text-emerald-400 font-medium">Chamada de voz ativa</span>
                <audio ref={remoteVideoRef as any} autoPlay />
              </div>
            )}
            <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs text-white font-medium flex items-center gap-1.5">
              {partnerFlag && <span className="text-base leading-none">{partnerFlag}</span>}
              Estranho: <span className="font-bold text-sky-400">{partnerName}</span>
              {partnerCountry && <span className="text-slate-400 text-[10px]">({partnerCountry})</span>}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
            <User className="w-12 h-12 stroke-[1.5]" />
            <span className="text-xs">Ninguém conectado no momento</span>
          </div>
        )}
      </div>

      {/* Local Video Preview (PiP overlay on desktop / secondary panel on mobile) */}
      <div className="relative md:absolute md:bottom-6 md:right-6 w-full md:w-60 h-36 md:h-40 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-700/80 shadow-2xl flex items-center justify-center">
        {mode === 'VIDEO' && !isVideoMuted ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400">
            <VideoOff className="w-6 h-6 text-slate-500" />
            <span className="text-[11px] font-semibold">Câmera Desligada</span>
          </div>
        )}

        <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium flex items-center gap-1">
          Você {isAudioMuted && <MicOff className="w-3 h-3 text-rose-500" />}
        </div>
      </div>
    </div>
  );
};
