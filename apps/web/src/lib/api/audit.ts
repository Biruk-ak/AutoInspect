import { apiRequest } from './client';

export interface AuditRecord {
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

export interface AuditQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateAuditInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateAuditInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchAuditList(
  token: string,
  query: AuditQuery = {},
): Promise<ListResponse<AuditRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<AuditRecord>>(`/audit?${params}`, { token });
}

export async function fetchAuditById(token: string, id: string): Promise<AuditRecord> {
  return apiRequest<AuditRecord>(`/audit/${id}`, { token });
}

export async function createAudit(
  token: string,
  input: CreateAuditInput,
): Promise<AuditRecord> {
  return apiRequest<AuditRecord>(`/audit`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateAudit(
  token: string,
  id: string,
  input: UpdateAuditInput,
): Promise<AuditRecord> {
  return apiRequest<AuditRecord>(`/audit/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteAudit(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/audit/${id}`, { token, method: 'DELETE' });
}

export async function cloneAudit(token: string, id: string): Promise<AuditRecord> {
  return apiRequest<AuditRecord>(`/audit/${id}/clone`, { token, method: 'POST' });
}

export async function exportAuditCsv(token: string, query: AuditQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/audit/export/csv?${params}`, { token, raw: true });
}
