import React from 'react';

const COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  pending: 'bg-amber-100 text-amber-800',
  active: 'bg-emerald-100 text-emerald-800',
  in_progress: 'bg-sky-100 text-sky-800',
  completed: 'bg-indigo-100 text-indigo-800',
  cancelled: 'bg-rose-100 text-rose-800',
  archived: 'bg-zinc-100 text-zinc-700',
  failed: 'bg-red-100 text-red-800',
};

export function StatusBadge({ status }: { status: string }) {
  const color = COLORS[status] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
