import { apiRequest } from './client';

export interface VehicleRecord {
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

export interface VehicleQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateVehicleInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateVehicleInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchVehicleList(
  token: string,
  query: VehicleQuery = {},
): Promise<ListResponse<VehicleRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<VehicleRecord>>(`/vehicles?${params}`, { token });
}

export async function fetchVehicleById(token: string, id: string): Promise<VehicleRecord> {
  return apiRequest<VehicleRecord>(`/vehicles/${id}`, { token });
}

export async function createVehicle(
  token: string,
  input: CreateVehicleInput,
): Promise<VehicleRecord> {
  return apiRequest<VehicleRecord>(`/vehicles`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateVehicle(
  token: string,
  id: string,
  input: UpdateVehicleInput,
): Promise<VehicleRecord> {
  return apiRequest<VehicleRecord>(`/vehicles/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteVehicle(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/vehicles/${id}`, { token, method: 'DELETE' });
}

export async function cloneVehicle(token: string, id: string): Promise<VehicleRecord> {
  return apiRequest<VehicleRecord>(`/vehicles/${id}/clone`, { token, method: 'POST' });
}

export async function exportVehicleCsv(token: string, query: VehicleQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/vehicles/export/csv?${params}`, { token, raw: true });
}
