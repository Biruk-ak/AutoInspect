import { apiRequest } from './client';

export interface InspectorRecord {
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

export interface InspectorQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateInspectorInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateInspectorInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchInspectorList(
  token: string,
  query: InspectorQuery = {},
): Promise<ListResponse<InspectorRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<InspectorRecord>>(`/inspectors?${params}`, { token });
}

export async function fetchInspectorById(token: string, id: string): Promise<InspectorRecord> {
  return apiRequest<InspectorRecord>(`/inspectors/${id}`, { token });
}

export async function createInspector(
  token: string,
  input: CreateInspectorInput,
): Promise<InspectorRecord> {
  return apiRequest<InspectorRecord>(`/inspectors`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateInspector(
  token: string,
  id: string,
  input: UpdateInspectorInput,
): Promise<InspectorRecord> {
  return apiRequest<InspectorRecord>(`/inspectors/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteInspector(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/inspectors/${id}`, { token, method: 'DELETE' });
}

export async function cloneInspector(token: string, id: string): Promise<InspectorRecord> {
  return apiRequest<InspectorRecord>(`/inspectors/${id}/clone`, { token, method: 'POST' });
}

export async function exportInspectorCsv(token: string, query: InspectorQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/inspectors/export/csv?${params}`, { token, raw: true });
}
