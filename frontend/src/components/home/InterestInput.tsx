'use client';

import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface InterestInputProps {
  interests: string[];
  onChange: (interests: string[]) => void;
}

export const InterestInput: React.FC<InterestInputProps> = ({ interests, onChange }) => {
  const [inputVal, setInputVal] = useState('');

  const addTag = (tag: string) => {
    const clean = tag.trim().toLowerCase();
    if (clean && !interests.includes(clean)) {
      onChange([...interests, clean]);
    }
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    }
  };

  const removeTag = (index: number) => {
    onChange(interests.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-sky-500" />
        Interesses (opcional):
      </label>

      <div className="min-h-[48px] p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex flex-wrap items-center gap-2 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
        {interests.map((interest, idx) => (
          <Badge key={idx} variant="sky" onRemove={() => removeTag(idx)}>
            {interest}
          </Badge>
        ))}

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={interests.length === 0 ? 'Ex: jogos, tecnologia, musica... (Pressione Enter)' : 'Adicionar...'}
          className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>
    </div>
  );
};
