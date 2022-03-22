import { apiRequest } from './client';

export interface ChecklistRecord {
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

export interface ChecklistQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateChecklistInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateChecklistInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchChecklistList(
  token: string,
  query: ChecklistQuery = {},
): Promise<ListResponse<ChecklistRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<ChecklistRecord>>(`/checklists?${params}`, { token });
}

export async function fetchChecklistById(token: string, id: string): Promise<ChecklistRecord> {
  return apiRequest<ChecklistRecord>(`/checklists/${id}`, { token });
}

export async function createChecklist(
  token: string,
  input: CreateChecklistInput,
): Promise<ChecklistRecord> {
  return apiRequest<ChecklistRecord>(`/checklists`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateChecklist(
  token: string,
  id: string,
  input: UpdateChecklistInput,
): Promise<ChecklistRecord> {
  return apiRequest<ChecklistRecord>(`/checklists/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteChecklist(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/checklists/${id}`, { token, method: 'DELETE' });
}

export async function cloneChecklist(token: string, id: string): Promise<ChecklistRecord> {
  return apiRequest<ChecklistRecord>(`/checklists/${id}/clone`, { token, method: 'POST' });
}

export async function exportChecklistCsv(token: string, query: ChecklistQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/checklists/export/csv?${params}`, { token, raw: true });
}
