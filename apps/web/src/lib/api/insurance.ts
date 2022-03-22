import { apiRequest } from './client';

export interface InsuranceRecord {
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

export interface InsuranceQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateInsuranceInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateInsuranceInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchInsuranceList(
  token: string,
  query: InsuranceQuery = {},
): Promise<ListResponse<InsuranceRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<InsuranceRecord>>(`/insurance?${params}`, { token });
}

export async function fetchInsuranceById(token: string, id: string): Promise<InsuranceRecord> {
  return apiRequest<InsuranceRecord>(`/insurance/${id}`, { token });
}

export async function createInsurance(
  token: string,
  input: CreateInsuranceInput,
): Promise<InsuranceRecord> {
  return apiRequest<InsuranceRecord>(`/insurance`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateInsurance(
  token: string,
  id: string,
  input: UpdateInsuranceInput,
): Promise<InsuranceRecord> {
  return apiRequest<InsuranceRecord>(`/insurance/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteInsurance(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/insurance/${id}`, { token, method: 'DELETE' });
}

export async function cloneInsurance(token: string, id: string): Promise<InsuranceRecord> {
  return apiRequest<InsuranceRecord>(`/insurance/${id}/clone`, { token, method: 'POST' });
}

export async function exportInsuranceCsv(token: string, query: InsuranceQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/insurance/export/csv?${params}`, { token, raw: true });
}
