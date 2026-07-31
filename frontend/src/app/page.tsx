'use client';

import React from 'react';
import { Header } from '../components/home/Header';
import { HeroSection } from '../components/home/HeroSection';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <HeroSection />
    </main>
  );
}
