'use client';

import React from 'react';
import { Users, User, Heart } from 'lucide-react';
import { Gender, PartnerGenderPreference } from '../../types';

interface GenderSelectorProps {
  partnerGender: PartnerGenderPreference;
  onPartnerGenderChange: (pref: PartnerGenderPreference) => void;
  myGender: Gender;
  onMyGenderChange: (gender: Gender) => void;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({
  partnerGender,
  onPartnerGenderChange,
  myGender,
  onMyGenderChange,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm shadow-inner">
      {/* Partner Preference */}
      <div>
        <label className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            Quero conversar com:
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Filtro de parceiro</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onPartnerGenderChange('MALE')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              partnerGender === 'MALE'
                ? 'border-blue-500/80 bg-blue-500/15 text-blue-400 font-bold shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20 scale-[1.02]'
                : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-sm">👨</span>
            <span>Homem</span>
          </button>

          <button
            type="button"
            onClick={() => onPartnerGenderChange('FEMALE')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              partnerGender === 'FEMALE'
                ? 'border-pink-500/80 bg-pink-500/15 text-pink-400 font-bold shadow-lg shadow-pink-500/10 ring-2 ring-pink-500/20 scale-[1.02]'
                : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-sm">👩</span>
            <span>Mulher</span>
          </button>

          <button
            type="button"
            onClick={() => onPartnerGenderChange('BOTH')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
              partnerGender === 'BOTH'
                ? 'border-sky-500/80 bg-sky-500/15 text-sky-400 font-bold shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20 scale-[1.02]'
                : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ambos</span>
          </button>
        </div>
      </div>

      {/* User's Own Gender */}
      <div className="pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-400" />
            Meu gênero:
          </label>
          {partnerGender !== 'BOTH' && myGender === 'UNSPECIFIED' && (
            <span className="text-[10px] text-amber-400 font-medium animate-pulse">
              Selecione para um pareamento exato
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onMyGenderChange('MALE')}
            className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
              myGender === 'MALE'
                ? 'border-blue-500/60 bg-blue-500/20 text-blue-300 font-semibold'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
            }`}
          >
            <span>👨 Homem</span>
          </button>

          <button
            type="button"
            onClick={() => onMyGenderChange('FEMALE')}
            className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
              myGender === 'FEMALE'
                ? 'border-pink-500/60 bg-pink-500/20 text-pink-300 font-semibold'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
            }`}
          >
            <span>👩 Mulher</span>
          </button>

          <button
            type="button"
            onClick={() => onMyGenderChange('UNSPECIFIED')}
            className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
              myGender === 'UNSPECIFIED'
                ? 'border-slate-600 bg-slate-800/70 text-slate-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
            }`}
          >
            <span>Ocultar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
