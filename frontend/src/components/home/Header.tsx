'use client';

import React from 'react';
import Link from 'next/link';
import { Video, Shield, User as UserIcon, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              OmegleNext
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
              Live Connect
            </span>
          </div>
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user && user.role === 'ADMIN' && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5">
                <Shield className="w-4 h-4 text-sky-500" />
                Painel Admin
              </Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
                {user.username}
              </span>
              <Button variant="outline" size="sm" onClick={logout} className="gap-1.5">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Criar conta
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
