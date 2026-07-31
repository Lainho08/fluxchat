'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Video, Mic, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { InterestInput } from './InterestInput';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMode } from '../../types';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { user, guestLogin } = useAuth();

  const [selectedMode, setSelectedMode] = useState<ChatMode>('VIDEO');
  const [interests, setInterests] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleStartChat = async () => {
    setIsConnecting(true);
    try {
      if (!user) {
        await guestLogin(interests);
      }
      const queryInterests = interests.length > 0 ? `?interests=${encodeURIComponent(interests.join(','))}` : '';
      router.push(`/chat?mode=${selectedMode.toLowerCase()}${queryInterests ? '&' + queryInterests.substring(1) : ''}`);
    } catch (error) {
      console.error('Error initiating chat:', error);
      setIsConnecting(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/15 dark:bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-blue-600/15 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-4 h-4" />
          Conexões P2P Rápidas, Anônimas e Seguras
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
          Conecte-se instantaneamente a pessoas{' '}
          <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            do mundo todo
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
          Conversas por texto, voz ou vídeo sem complicação. Escolha seus interesses ou entre em uma sala aleatória agora mesmo.
        </p>

        {/* Action Card */}
        <Card className="max-w-xl mx-auto text-left shadow-2xl relative border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col gap-6">
            {/* Mode Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                Selecione o modo de conversa:
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMode('VIDEO')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                    selectedMode === 'VIDEO'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Video className="w-6 h-6 mb-1.5" />
                  <span className="text-xs">Vídeo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('TEXT')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                    selectedMode === 'TEXT'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <MessageSquare className="w-6 h-6 mb-1.5" />
                  <span className="text-xs">Texto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMode('AUDIO')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                    selectedMode === 'AUDIO'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Mic className="w-6 h-6 mb-1.5" />
                  <span className="text-xs">Voz</span>
                </button>
              </div>
            </div>

            {/* Interest Tags */}
            <InterestInput interests={interests} onChange={setInterests} />

            {/* Main Call To Action */}
            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartChat}
                disabled={isConnecting}
                className="w-full text-base font-bold shadow-xl py-3.5"
              >
                {isConnecting ? 'Iniciando matchmaking...' : 'Conversar Agora'}
              </Button>

              {!user && (
                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Você entrará como usuário anônimo. Sem necessidade de cadastro.
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
