import { apiRequest } from './client';

export interface PaymentRecord {
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

export interface PaymentQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreatePaymentInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdatePaymentInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchPaymentList(
  token: string,
  query: PaymentQuery = {},
): Promise<ListResponse<PaymentRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<PaymentRecord>>(`/payments?${params}`, { token });
}

export async function fetchPaymentById(token: string, id: string): Promise<PaymentRecord> {
  return apiRequest<PaymentRecord>(`/payments/${id}`, { token });
}

export async function createPayment(
  token: string,
  input: CreatePaymentInput,
): Promise<PaymentRecord> {
  return apiRequest<PaymentRecord>(`/payments`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updatePayment(
  token: string,
  id: string,
  input: UpdatePaymentInput,
): Promise<PaymentRecord> {
  return apiRequest<PaymentRecord>(`/payments/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deletePayment(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/payments/${id}`, { token, method: 'DELETE' });
}

export async function clonePayment(token: string, id: string): Promise<PaymentRecord> {
  return apiRequest<PaymentRecord>(`/payments/${id}/clone`, { token, method: 'POST' });
}

export async function exportPaymentCsv(token: string, query: PaymentQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/payments/export/csv?${params}`, { token, raw: true });
}
