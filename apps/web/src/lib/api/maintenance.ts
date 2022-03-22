import { apiRequest } from './client';

export interface MaintenanceRecord {
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

export interface MaintenanceQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateMaintenanceInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateMaintenanceInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchMaintenanceList(
  token: string,
  query: MaintenanceQuery = {},
): Promise<ListResponse<MaintenanceRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<MaintenanceRecord>>(`/maintenance?${params}`, { token });
}

export async function fetchMaintenanceById(token: string, id: string): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>(`/maintenance/${id}`, { token });
}

export async function createMaintenance(
  token: string,
  input: CreateMaintenanceInput,
): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>(`/maintenance`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateMaintenance(
  token: string,
  id: string,
  input: UpdateMaintenanceInput,
): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>(`/maintenance/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteMaintenance(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/maintenance/${id}`, { token, method: 'DELETE' });
}

export async function cloneMaintenance(token: string, id: string): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>(`/maintenance/${id}/clone`, { token, method: 'POST' });
}

export async function exportMaintenanceCsv(token: string, query: MaintenanceQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/maintenance/export/csv?${params}`, { token, raw: true });
}
