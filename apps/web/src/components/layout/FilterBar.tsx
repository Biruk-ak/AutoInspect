'use client';
import React from 'react';

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statuses,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <input
        aria-label="Search records"
        className="min-w-[220px] flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
        placeholder="Search…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        aria-label="Filter by status"
        className="rounded border border-slate-300 px-3 py-2 text-sm"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
