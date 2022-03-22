import { apiRequest } from './client';

export interface UserRecord {
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

export interface UserQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateUserInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateUserInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchUserList(
  token: string,
  query: UserQuery = {},
): Promise<ListResponse<UserRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<UserRecord>>(`/users?${params}`, { token });
}

export async function fetchUserById(token: string, id: string): Promise<UserRecord> {
  return apiRequest<UserRecord>(`/users/${id}`, { token });
}

export async function createUser(
  token: string,
  input: CreateUserInput,
): Promise<UserRecord> {
  return apiRequest<UserRecord>(`/users`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateUser(
  token: string,
  id: string,
  input: UpdateUserInput,
): Promise<UserRecord> {
  return apiRequest<UserRecord>(`/users/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteUser(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/users/${id}`, { token, method: 'DELETE' });
}

export async function cloneUser(token: string, id: string): Promise<UserRecord> {
  return apiRequest<UserRecord>(`/users/${id}/clone`, { token, method: 'POST' });
}

export async function exportUserCsv(token: string, query: UserQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/users/export/csv?${params}`, { token, raw: true });
}
