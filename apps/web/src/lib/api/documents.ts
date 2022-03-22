import { apiRequest } from './client';

export interface DocumentRecord {
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

export interface DocumentQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateDocumentInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateDocumentInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchDocumentList(
  token: string,
  query: DocumentQuery = {},
): Promise<ListResponse<DocumentRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<DocumentRecord>>(`/documents?${params}`, { token });
}

export async function fetchDocumentById(token: string, id: string): Promise<DocumentRecord> {
  return apiRequest<DocumentRecord>(`/documents/${id}`, { token });
}

export async function createDocument(
  token: string,
  input: CreateDocumentInput,
): Promise<DocumentRecord> {
  return apiRequest<DocumentRecord>(`/documents`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateDocument(
  token: string,
  id: string,
  input: UpdateDocumentInput,
): Promise<DocumentRecord> {
  return apiRequest<DocumentRecord>(`/documents/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteDocument(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/documents/${id}`, { token, method: 'DELETE' });
}

export async function cloneDocument(token: string, id: string): Promise<DocumentRecord> {
  return apiRequest<DocumentRecord>(`/documents/${id}/clone`, { token, method: 'POST' });
}

export async function exportDocumentCsv(token: string, query: DocumentQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/documents/export/csv?${params}`, { token, raw: true });
}
