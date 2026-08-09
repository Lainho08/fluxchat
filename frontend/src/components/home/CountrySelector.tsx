'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { COUNTRY_LIST, detectMyCountry } from '../../utils/geo';

interface CountrySelectorProps {
  value: string; // country code or 'ANY'
  onChange: (code: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Auto-detect and pre-select the user's country on mount
  useEffect(() => {
    detectMyCountry().then((geo) => {
      if (geo) {
        const found = COUNTRY_LIST.find((c) => c.code === geo.countryCode);
        if (found) onChange(found.code);
      }
    });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = COUNTRY_LIST.find((c) => c.code === value) ?? COUNTRY_LIST[0];
  const filtered = search
    ? COUNTRY_LIST.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRY_LIST;

  return (
    <div ref={ref} className="relative">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
        Filtrar por país:
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
          open
            ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-500/5 dark:bg-sky-500/5'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-600'
        } text-slate-900 dark:text-slate-100`}
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <span className="flex-1 truncate">{selected.name}</span>
        {value !== 'ANY' && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-500">
            Filtro ativo
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar país..."
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Nenhum país encontrado</p>
            ) : (
              filtered.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onChange(country.code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                    country.code === value
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-lg leading-none w-6 text-center">{country.flag}</span>
                  <span className="truncate">{country.name}</span>
                  {country.code !== 'ANY' && (
                    <span className="ml-auto text-[10px] text-slate-400">{country.code}</span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Fallback info */}
          {value !== 'ANY' && (
            <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-900/10">
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                ⚡ Se não encontrar ninguém do país selecionado, você será conectado a alguém de outro país automaticamente.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
