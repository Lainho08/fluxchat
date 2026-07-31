import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sky' | 'emerald' | 'rose' | 'amber' | 'slate';
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'sky', onRemove }) => {
  const styles = {
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border',
        styles[variant]
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-75 focus:outline-none ml-1 text-xs font-bold"
        >
          ×
        </button>
      )}
    </span>
  );
};
