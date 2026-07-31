'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, Settings, SkipForward, PhoneOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { useWebRTC } from '../../contexts/WebRTCContext';
import { DeviceSelector } from './DeviceSelector';

interface MediaControlsProps {
  onSkip: () => void;
  onLeave: () => void;
  mode: 'TEXT' | 'VIDEO' | 'AUDIO';
}

export const MediaControls: React.FC<MediaControlsProps> = ({ onSkip, onLeave, mode }) => {
  const {
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = useWebRTC();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex items-center justify-between gap-2 backdrop-blur-md">
        {/* Left Side Media Toggles (Video & Voice Modes) */}
        <div className="flex items-center gap-2">
          {mode !== 'TEXT' && (
            <>
              <button
                type="button"
                onClick={toggleAudio}
                className={`p-3 rounded-xl border transition-all ${
                  isAudioMuted
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={isAudioMuted ? 'Ativar Microfone' : 'Desativar Microfone'}
              >
                {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {mode === 'VIDEO' && (
                <>
                  <button
                    type="button"
                    onClick={toggleVideo}
                    className={`p-3 rounded-xl border transition-all ${
                      isVideoMuted
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={isVideoMuted ? 'Ligar Câmera' : 'Desligar Câmera'}
                  >
                    {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleScreenShare}
                    className={`p-3 rounded-xl border transition-all hidden sm:flex ${
                      isScreenSharing
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-500'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={isScreenSharing ? 'Parar Compartilhamento' : 'Compartilhar Tela'}
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                title="Configurações de Dispositivo"
              >
                <Settings className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Right Side Partner Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="danger" size="md" onClick={onLeave} className="gap-1.5 px-3 sm:px-4">
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>

          <Button variant="primary" size="md" onClick={onSkip} className="gap-2 px-4 sm:px-6 font-bold shadow-sky-500/25">
            <SkipForward className="w-4 h-4" />
            Próximo (Esc)
          </Button>
        </div>
      </div>

      <DeviceSelector isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
