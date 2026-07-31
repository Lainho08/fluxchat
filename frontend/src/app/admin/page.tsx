'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, RefreshCw } from 'lucide-react';
import { Header } from '../../components/home/Header';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { ActiveRoomsTable } from '../../components/admin/ActiveRoomsTable';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchDashboard();
      }
    }
  }, [user, isAuthLoading]);

  if (isAuthLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Painel Administrativo</h1>
              <p className="text-xs text-slate-500">Métricas em tempo real e monitoramento da plataforma</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={fetchDashboard} disabled={isLoading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <DashboardStats metrics={data?.metrics} />
        <ActiveRoomsTable recentLogs={data?.recentLogs} recentUsers={data?.recentUsers} />
      </main>
    </div>
  );
}
