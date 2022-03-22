import { apiRequest } from './client';

export interface ReviewRecord {
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

export interface ReviewQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateReviewInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateReviewInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchReviewList(
  token: string,
  query: ReviewQuery = {},
): Promise<ListResponse<ReviewRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<ReviewRecord>>(`/reviews?${params}`, { token });
}

export async function fetchReviewById(token: string, id: string): Promise<ReviewRecord> {
  return apiRequest<ReviewRecord>(`/reviews/${id}`, { token });
}

export async function createReview(
  token: string,
  input: CreateReviewInput,
): Promise<ReviewRecord> {
  return apiRequest<ReviewRecord>(`/reviews`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateReview(
  token: string,
  id: string,
  input: UpdateReviewInput,
): Promise<ReviewRecord> {
  return apiRequest<ReviewRecord>(`/reviews/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteReview(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/reviews/${id}`, { token, method: 'DELETE' });
}

export async function cloneReview(token: string, id: string): Promise<ReviewRecord> {
  return apiRequest<ReviewRecord>(`/reviews/${id}/clone`, { token, method: 'POST' });
}

export async function exportReviewCsv(token: string, query: ReviewQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/reviews/export/csv?${params}`, { token, raw: true });
}
