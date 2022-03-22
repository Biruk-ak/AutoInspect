import { apiRequest } from './client';

export interface SettingsRecord {
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

export interface SettingsQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateSettingsInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSettingsInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchSettingsList(
  token: string,
  query: SettingsQuery = {},
): Promise<ListResponse<SettingsRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<SettingsRecord>>(`/settings?${params}`, { token });
}

export async function fetchSettingsById(token: string, id: string): Promise<SettingsRecord> {
  return apiRequest<SettingsRecord>(`/settings/${id}`, { token });
}

export async function createSettings(
  token: string,
  input: CreateSettingsInput,
): Promise<SettingsRecord> {
  return apiRequest<SettingsRecord>(`/settings`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateSettings(
  token: string,
  id: string,
  input: UpdateSettingsInput,
): Promise<SettingsRecord> {
  return apiRequest<SettingsRecord>(`/settings/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteSettings(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/settings/${id}`, { token, method: 'DELETE' });
}

export async function cloneSettings(token: string, id: string): Promise<SettingsRecord> {
  return apiRequest<SettingsRecord>(`/settings/${id}/clone`, { token, method: 'POST' });
}

export async function exportSettingsCsv(token: string, query: SettingsQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/settings/export/csv?${params}`, { token, raw: true });
}
