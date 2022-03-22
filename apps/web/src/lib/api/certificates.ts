import { apiRequest } from './client';

export interface CertificateRecord {
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

export interface CertificateQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateCertificateInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCertificateInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchCertificateList(
  token: string,
  query: CertificateQuery = {},
): Promise<ListResponse<CertificateRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<CertificateRecord>>(`/certificates?${params}`, { token });
}

export async function fetchCertificateById(token: string, id: string): Promise<CertificateRecord> {
  return apiRequest<CertificateRecord>(`/certificates/${id}`, { token });
}

export async function createCertificate(
  token: string,
  input: CreateCertificateInput,
): Promise<CertificateRecord> {
  return apiRequest<CertificateRecord>(`/certificates`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateCertificate(
  token: string,
  id: string,
  input: UpdateCertificateInput,
): Promise<CertificateRecord> {
  return apiRequest<CertificateRecord>(`/certificates/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteCertificate(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/certificates/${id}`, { token, method: 'DELETE' });
}

export async function cloneCertificate(token: string, id: string): Promise<CertificateRecord> {
  return apiRequest<CertificateRecord>(`/certificates/${id}/clone`, { token, method: 'POST' });
}

export async function exportCertificateCsv(token: string, query: CertificateQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/certificates/export/csv?${params}`, { token, raw: true });
}
