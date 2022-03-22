import { apiRequest } from './client';

export interface ComplianceRecord {
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

export interface ComplianceQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateComplianceInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateComplianceInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchComplianceList(
  token: string,
  query: ComplianceQuery = {},
): Promise<ListResponse<ComplianceRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<ComplianceRecord>>(`/compliance?${params}`, { token });
}

export async function fetchComplianceById(token: string, id: string): Promise<ComplianceRecord> {
  return apiRequest<ComplianceRecord>(`/compliance/${id}`, { token });
}

export async function createCompliance(
  token: string,
  input: CreateComplianceInput,
): Promise<ComplianceRecord> {
  return apiRequest<ComplianceRecord>(`/compliance`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateCompliance(
  token: string,
  id: string,
  input: UpdateComplianceInput,
): Promise<ComplianceRecord> {
  return apiRequest<ComplianceRecord>(`/compliance/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteCompliance(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/compliance/${id}`, { token, method: 'DELETE' });
}

export async function cloneCompliance(token: string, id: string): Promise<ComplianceRecord> {
  return apiRequest<ComplianceRecord>(`/compliance/${id}/clone`, { token, method: 'POST' });
}

export async function exportComplianceCsv(token: string, query: ComplianceQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/compliance/export/csv?${params}`, { token, raw: true });
}
