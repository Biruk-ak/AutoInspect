import { apiRequest } from './client';

export interface GarageRecord {
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

export interface GarageQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateGarageInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateGarageInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchGarageList(
  token: string,
  query: GarageQuery = {},
): Promise<ListResponse<GarageRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<GarageRecord>>(`/garages?${params}`, { token });
}

export async function fetchGarageById(token: string, id: string): Promise<GarageRecord> {
  return apiRequest<GarageRecord>(`/garages/${id}`, { token });
}

export async function createGarage(
  token: string,
  input: CreateGarageInput,
): Promise<GarageRecord> {
  return apiRequest<GarageRecord>(`/garages`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateGarage(
  token: string,
  id: string,
  input: UpdateGarageInput,
): Promise<GarageRecord> {
  return apiRequest<GarageRecord>(`/garages/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteGarage(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/garages/${id}`, { token, method: 'DELETE' });
}

export async function cloneGarage(token: string, id: string): Promise<GarageRecord> {
  return apiRequest<GarageRecord>(`/garages/${id}/clone`, { token, method: 'POST' });
}

export async function exportGarageCsv(token: string, query: GarageQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/garages/export/csv?${params}`, { token, raw: true });
}
