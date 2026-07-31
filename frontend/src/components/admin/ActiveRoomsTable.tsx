'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ActiveRoomsTableProps {
  recentLogs?: any[];
  recentUsers?: any[];
}

export const ActiveRoomsTable: React.FC<ActiveRoomsTableProps> = ({ recentLogs = [], recentUsers = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
      {/* Users Table */}
      <Card className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Usuários Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-100 dark:bg-slate-800/60 text-slate-500">
              <tr>
                <th className="p-2.5 rounded-l-lg">Usuário</th>
                <th className="p-2.5">Tipo</th>
                <th className="p-2.5 rounded-r-lg">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-400">Nenhum registro ainda</td>
                </tr>
              ) : (
                recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="p-2.5 font-medium">{u.username}</td>
                    <td className="p-2.5">
                      <Badge variant={u.isGuest ? 'amber' : 'emerald'}>
                        {u.isGuest ? 'Convidado' : 'Registrado'}
                      </Badge>
                    </td>
                    <td className="p-2.5 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Logs Feed */}
      <Card className="flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Logs do Sistema</h3>
        <div className="overflow-y-auto max-h-80 flex flex-col gap-2">
          {recentLogs.length === 0 ? (
            <span className="text-xs text-slate-400 text-center py-4">Nenhum log registrado</span>
          ) : (
            recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-start justify-between text-xs"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{log.message}</span>
                  <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <Badge
                  variant={
                    log.level === 'ERROR' ? 'rose' : log.level === 'WARN' ? 'amber' : 'sky'
                  }
                >
                  {log.level}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
