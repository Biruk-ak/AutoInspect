import { apiRequest } from './client';

export interface AppointmentRecord {
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

export interface AppointmentQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateAppointmentInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateAppointmentInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchAppointmentList(
  token: string,
  query: AppointmentQuery = {},
): Promise<ListResponse<AppointmentRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<AppointmentRecord>>(`/appointments?${params}`, { token });
}

export async function fetchAppointmentById(token: string, id: string): Promise<AppointmentRecord> {
  return apiRequest<AppointmentRecord>(`/appointments/${id}`, { token });
}

export async function createAppointment(
  token: string,
  input: CreateAppointmentInput,
): Promise<AppointmentRecord> {
  return apiRequest<AppointmentRecord>(`/appointments`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateAppointment(
  token: string,
  id: string,
  input: UpdateAppointmentInput,
): Promise<AppointmentRecord> {
  return apiRequest<AppointmentRecord>(`/appointments/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteAppointment(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/appointments/${id}`, { token, method: 'DELETE' });
}

export async function cloneAppointment(token: string, id: string): Promise<AppointmentRecord> {
  return apiRequest<AppointmentRecord>(`/appointments/${id}/clone`, { token, method: 'POST' });
}

export async function exportAppointmentCsv(token: string, query: AppointmentQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/appointments/export/csv?${params}`, { token, raw: true });
}
