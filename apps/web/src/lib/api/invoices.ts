import { apiRequest } from './client';

export interface InvoiceRecord {
  id: string;
  status: string;
  notes?: string;
  metadata: Record<string, unknown>;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  priority: number;
  tags: string[];
  amount?: number;
  currency?: string;
  externalRef?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface InvoiceQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateInvoiceInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateInvoiceInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchInvoiceList(
  token: string,
  query: InvoiceQuery = {},
): Promise<ListResponse<InvoiceRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<InvoiceRecord>>(`/invoices?${params}`, { token });
}

export async function fetchInvoiceById(token: string, id: string): Promise<InvoiceRecord> {
  return apiRequest<InvoiceRecord>(`/invoices/${id}`, { token });
}

export async function createInvoice(
  token: string,
  input: CreateInvoiceInput,
): Promise<InvoiceRecord> {
  return apiRequest<InvoiceRecord>(`/invoices`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateInvoice(
  token: string,
  id: string,
  input: UpdateInvoiceInput,
): Promise<InvoiceRecord> {
  return apiRequest<InvoiceRecord>(`/invoices/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteInvoice(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/invoices/${id}`, { token, method: 'DELETE' });
}

export async function cloneInvoice(token: string, id: string): Promise<InvoiceRecord> {
  return apiRequest<InvoiceRecord>(`/invoices/${id}/clone`, { token, method: 'POST' });
}

export async function exportInvoiceCsv(token: string, query: InvoiceQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/invoices/export/csv?${params}`, { token, raw: true });
}
