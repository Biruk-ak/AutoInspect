'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  fetchInvoiceById,
  updateInvoice,
  type InvoiceRecord,
} from '@/lib/api/invoices';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { formatCurrency, formatDate } from '@/lib/format';

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const { push } = useToast();
  const [record, setRecord] = useState<InvoiceRecord | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token || !params.id) return;
    setLoading(true);
    fetchInvoiceById(token, params.id)
      .then((data) => {
        setRecord(data);
        setNotes(data.notes || '');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [token, params.id]);

  const onSave = async () => {
    if (!token || !record) return;
    setSaving(true);
    try {
      const updated = await updateInvoice(token, record.id, { notes });
      setRecord(updated);
      push({ type: 'success', message: 'Saved' });
    } catch (err) {
      push({ type: 'error', message: err instanceof Error ? err.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading detail…" />;
  if (error) return <ErrorAlert message={error} onRetry={() => router.refresh()} />;
  if (!record) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <PageHeader
        title="Invoice detail"
        subtitle={record.id}
        actions={<StatusBadge status={record.status} />}
      />
      <dl className="grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-white p-6">
        <div>
          <dt className="text-xs uppercase text-slate-500">Amount</dt>
          <dd className="text-lg font-medium">{formatCurrency(record.amount || 0, record.currency || 'USD')}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Created</dt>
          <dd className="text-lg font-medium">{formatDate(record.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Priority</dt>
          <dd className="text-lg font-medium">{record.priority}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-slate-500">Organization</dt>
          <dd className="text-lg font-medium">{record.organizationId}</dd>
        </div>
      </dl>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          className="min-h-32 w-full rounded border border-slate-300 p-3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="button"
          disabled={saving}
          onClick={() => void onSave()}
          className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
