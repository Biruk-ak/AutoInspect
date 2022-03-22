import { apiRequest } from './client';

export interface PhotoRecord {
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

export interface PhotoQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreatePhotoInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdatePhotoInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchPhotoList(
  token: string,
  query: PhotoQuery = {},
): Promise<ListResponse<PhotoRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<PhotoRecord>>(`/photos?${params}`, { token });
}

export async function fetchPhotoById(token: string, id: string): Promise<PhotoRecord> {
  return apiRequest<PhotoRecord>(`/photos/${id}`, { token });
}

export async function createPhoto(
  token: string,
  input: CreatePhotoInput,
): Promise<PhotoRecord> {
  return apiRequest<PhotoRecord>(`/photos`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updatePhoto(
  token: string,
  id: string,
  input: UpdatePhotoInput,
): Promise<PhotoRecord> {
  return apiRequest<PhotoRecord>(`/photos/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deletePhoto(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/photos/${id}`, { token, method: 'DELETE' });
}

export async function clonePhoto(token: string, id: string): Promise<PhotoRecord> {
  return apiRequest<PhotoRecord>(`/photos/${id}/clone`, { token, method: 'POST' });
}

export async function exportPhotoCsv(token: string, query: PhotoQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/photos/export/csv?${params}`, { token, raw: true });
}
