import { apiRequest } from './client';

export interface RegionRecord {
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

export interface RegionQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateRegionInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateRegionInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchRegionList(
  token: string,
  query: RegionQuery = {},
): Promise<ListResponse<RegionRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<RegionRecord>>(`/regions?${params}`, { token });
}

export async function fetchRegionById(token: string, id: string): Promise<RegionRecord> {
  return apiRequest<RegionRecord>(`/regions/${id}`, { token });
}

export async function createRegion(
  token: string,
  input: CreateRegionInput,
): Promise<RegionRecord> {
  return apiRequest<RegionRecord>(`/regions`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateRegion(
  token: string,
  id: string,
  input: UpdateRegionInput,
): Promise<RegionRecord> {
  return apiRequest<RegionRecord>(`/regions/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteRegion(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/regions/${id}`, { token, method: 'DELETE' });
}

export async function cloneRegion(token: string, id: string): Promise<RegionRecord> {
  return apiRequest<RegionRecord>(`/regions/${id}/clone`, { token, method: 'POST' });
}

export async function exportRegionCsv(token: string, query: RegionQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/regions/export/csv?${params}`, { token, raw: true });
}
