import { apiRequest } from './client';

export interface SubscriptionRecord {
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

export interface SubscriptionQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateSubscriptionInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSubscriptionInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchSubscriptionList(
  token: string,
  query: SubscriptionQuery = {},
): Promise<ListResponse<SubscriptionRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<SubscriptionRecord>>(`/subscriptions?${params}`, { token });
}

export async function fetchSubscriptionById(token: string, id: string): Promise<SubscriptionRecord> {
  return apiRequest<SubscriptionRecord>(`/subscriptions/${id}`, { token });
}

export async function createSubscription(
  token: string,
  input: CreateSubscriptionInput,
): Promise<SubscriptionRecord> {
  return apiRequest<SubscriptionRecord>(`/subscriptions`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateSubscription(
  token: string,
  id: string,
  input: UpdateSubscriptionInput,
): Promise<SubscriptionRecord> {
  return apiRequest<SubscriptionRecord>(`/subscriptions/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteSubscription(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/subscriptions/${id}`, { token, method: 'DELETE' });
}

export async function cloneSubscription(token: string, id: string): Promise<SubscriptionRecord> {
  return apiRequest<SubscriptionRecord>(`/subscriptions/${id}/clone`, { token, method: 'POST' });
}

export async function exportSubscriptionCsv(token: string, query: SubscriptionQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/subscriptions/export/csv?${params}`, { token, raw: true });
}
