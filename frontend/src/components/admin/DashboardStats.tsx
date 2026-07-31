'use client';

import React from 'react';
import { Users, Video, Activity, MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';

interface DashboardStatsProps {
  metrics?: {
    onlineUsers: number;
    activeRooms: number;
    activeSessions: number;
    totalUsers: number;
    totalConnections: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Usuários Online',
      value: metrics?.onlineUsers || 0,
      icon: Users,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Salas Ativas',
      value: metrics?.activeRooms || 0,
      icon: Video,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
    },
    {
      title: 'Sessões Ativas',
      value: metrics?.activeSessions || 0,
      icon: Activity,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Total Conexões',
      value: metrics?.totalConnections || 0,
      icon: MessageSquare,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="flex items-center gap-4 p-5">
            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {item.title}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {item.value}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
