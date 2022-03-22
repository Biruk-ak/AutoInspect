import { apiRequest } from './client';

export interface AnalyticsRecord {
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

export interface AnalyticsQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateAnalyticsInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateAnalyticsInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchAnalyticsList(
  token: string,
  query: AnalyticsQuery = {},
): Promise<ListResponse<AnalyticsRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<AnalyticsRecord>>(`/analytics?${params}`, { token });
}

export async function fetchAnalyticsById(token: string, id: string): Promise<AnalyticsRecord> {
  return apiRequest<AnalyticsRecord>(`/analytics/${id}`, { token });
}

export async function createAnalytics(
  token: string,
  input: CreateAnalyticsInput,
): Promise<AnalyticsRecord> {
  return apiRequest<AnalyticsRecord>(`/analytics`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateAnalytics(
  token: string,
  id: string,
  input: UpdateAnalyticsInput,
): Promise<AnalyticsRecord> {
  return apiRequest<AnalyticsRecord>(`/analytics/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteAnalytics(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/analytics/${id}`, { token, method: 'DELETE' });
}

export async function cloneAnalytics(token: string, id: string): Promise<AnalyticsRecord> {
  return apiRequest<AnalyticsRecord>(`/analytics/${id}/clone`, { token, method: 'POST' });
}

export async function exportAnalyticsCsv(token: string, query: AnalyticsQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/analytics/export/csv?${params}`, { token, raw: true });
}
