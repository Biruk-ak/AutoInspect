'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  fetchCustomerList,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type CustomerRecord,
  type ListResponse,
} from '@/lib/api/customers';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { FilterBar } from '@/components/layout/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { formatCurrency, formatDate } from '@/lib/format';

export default function CustomerPage() {
  const { user, token } = useAuth();
  const { push } = useToast();
  const [items, setItems] = useState<CustomerRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const query = useMemo(
    () => ({ page, limit, status: status || undefined, search: search || undefined }),
    [page, limit, status, search],
  );

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res: ListResponse<CustomerRecord> = await fetchCustomerList(token, query);
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [token, query]);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async () => {
    if (!token) return;
    setCreating(true);
    try {
      await createCustomer(token, {
        status: 'draft',
        notes: 'Created from customer portal by ' + (user?.email || 'unknown'),
        organizationId: user?.organizationId,
        priority: 50,
      });
      push({ type: 'success', message: 'Customer created' });
      await load();
    } catch (err) {
      push({ type: 'error', message: err instanceof Error ? err.message : 'Create failed' });
    } finally {
      setCreating(false);
    }
  };

  const onUpdateStatus = async (id: string, next: string) => {
    if (!token) return;
    try {
      await updateCustomer(token, id, { status: next });
      push({ type: 'success', message: 'Status updated' });
      await load();
    } catch (err) {
      push({ type: 'error', message: err instanceof Error ? err.message : 'Update failed' });
    }
  };

  const onDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteCustomer(token, id);
      push({ type: 'success', message: 'Deleted' });
      await load();
    } catch (err) {
      push({ type: 'error', message: err instanceof Error ? err.message : 'Delete failed' });
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (row: CustomerRecord) => (
        <Link href={'/customer/customers/' + row.id} className="text-sky-700 underline">
          {row.id.slice(0, 8)}
        </Link>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: CustomerRecord) => <StatusBadge status={row.status} />,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row: CustomerRecord) => formatCurrency(row.amount || 0, row.currency || 'USD'),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row: CustomerRecord) => <span>{row.priority}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row: CustomerRecord) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: CustomerRecord) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded bg-emerald-600 px-2 py-1 text-xs text-white"
            onClick={() => void onUpdateStatus(row.id, 'active')}
          >
            Activate
          </button>
          <button
            type="button"
            className="rounded bg-rose-600 px-2 py-1 text-xs text-white"
            onClick={() => void onDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <PageHeader
        title="Customer"
        subtitle="customer portal — manage customers for AutoInspect"
        actions={
          <button
            type="button"
            disabled={creating}
            onClick={() => void onCreate()}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            {creating ? 'Creating…' : 'New Customer'}
          </button>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statuses={['draft', 'active', 'completed', 'cancelled', 'archived']}
      />

      {error ? <ErrorAlert message={error} onRetry={() => void load()} /> : null}
      {loading ? <LoadingSpinner label="Loading customers…" /> : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Create the first record to get started."
          actionLabel="Create"
          onAction={() => void onCreate()}
        />
      ) : null}
      {!loading && items.length > 0 ? (
        <DataTable
          columns={columns}
          rows={items}
          selected={selected}
          onSelectedChange={setSelected}
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      ) : null}
    </div>
  );
}
