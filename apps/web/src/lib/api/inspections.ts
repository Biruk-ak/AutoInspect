import { apiRequest } from './client';

export interface InspectionRecord {
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

export interface InspectionQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateInspectionInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateInspectionInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchInspectionList(
  token: string,
  query: InspectionQuery = {},
): Promise<ListResponse<InspectionRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<InspectionRecord>>(`/inspections?${params}`, { token });
}

export async function fetchInspectionById(token: string, id: string): Promise<InspectionRecord> {
  return apiRequest<InspectionRecord>(`/inspections/${id}`, { token });
}

export async function createInspection(
  token: string,
  input: CreateInspectionInput,
): Promise<InspectionRecord> {
  return apiRequest<InspectionRecord>(`/inspections`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateInspection(
  token: string,
  id: string,
  input: UpdateInspectionInput,
): Promise<InspectionRecord> {
  return apiRequest<InspectionRecord>(`/inspections/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteInspection(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/inspections/${id}`, { token, method: 'DELETE' });
}

export async function cloneInspection(token: string, id: string): Promise<InspectionRecord> {
  return apiRequest<InspectionRecord>(`/inspections/${id}/clone`, { token, method: 'POST' });
}

export async function exportInspectionCsv(token: string, query: InspectionQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/inspections/export/csv?${params}`, { token, raw: true });
}
