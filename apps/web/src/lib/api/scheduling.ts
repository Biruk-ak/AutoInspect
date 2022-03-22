import { apiRequest } from './client';

export interface SchedulingRecord {
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

export interface SchedulingQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateSchedulingInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSchedulingInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchSchedulingList(
  token: string,
  query: SchedulingQuery = {},
): Promise<ListResponse<SchedulingRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<SchedulingRecord>>(`/scheduling?${params}`, { token });
}

export async function fetchSchedulingById(token: string, id: string): Promise<SchedulingRecord> {
  return apiRequest<SchedulingRecord>(`/scheduling/${id}`, { token });
}

export async function createScheduling(
  token: string,
  input: CreateSchedulingInput,
): Promise<SchedulingRecord> {
  return apiRequest<SchedulingRecord>(`/scheduling`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateScheduling(
  token: string,
  id: string,
  input: UpdateSchedulingInput,
): Promise<SchedulingRecord> {
  return apiRequest<SchedulingRecord>(`/scheduling/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteScheduling(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/scheduling/${id}`, { token, method: 'DELETE' });
}

export async function cloneScheduling(token: string, id: string): Promise<SchedulingRecord> {
  return apiRequest<SchedulingRecord>(`/scheduling/${id}/clone`, { token, method: 'POST' });
}

export async function exportSchedulingCsv(token: string, query: SchedulingQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/scheduling/export/csv?${params}`, { token, raw: true });
}
