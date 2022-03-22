'use client';
import React from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
}

interface Props<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  selected,
  onSelectedChange,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: Props<T>) {
  const totalPages = Math.ceil(total / limit) || 1;
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) =>
                  onSelectedChange(e.target.checked ? rows.map((r) => r.id) : [])
                }
              />
            </th>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left font-semibold text-slate-700">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  onChange={(e) => {
                    if (e.target.checked) onSelectedChange([...selected, row.id]);
                    else onSelectedChange(selected.filter((id) => id !== row.id));
                  }}
                />
              </td>
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-slate-800">
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
        <div className="text-xs text-slate-500">
          Page {page} of {totalPages} · {total} total
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded border border-slate-300 px-2 py-1 text-xs"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={page <= 1}
            className="rounded border px-2 py-1 text-xs disabled:opacity-40"
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            className="rounded border px-2 py-1 text-xs disabled:opacity-40"
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
