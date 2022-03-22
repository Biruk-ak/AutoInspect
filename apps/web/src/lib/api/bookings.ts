import { apiRequest } from './client';

export interface BookingRecord {
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

export interface BookingQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  organizationId?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}

export interface CreateBookingInput {
  status?: string;
  notes?: string;
  organizationId?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateBookingInput {
  status?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  amount?: number;
  metadata?: Record<string, unknown>;
}

export async function fetchBookingList(
  token: string,
  query: BookingQuery = {},
): Promise<ListResponse<BookingRecord>> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<ListResponse<BookingRecord>>(`/bookings?${params}`, { token });
}

export async function fetchBookingById(token: string, id: string): Promise<BookingRecord> {
  return apiRequest<BookingRecord>(`/bookings/${id}`, { token });
}

export async function createBooking(
  token: string,
  input: CreateBookingInput,
): Promise<BookingRecord> {
  return apiRequest<BookingRecord>(`/bookings`, {
    token,
    method: 'POST',
    body: input,
  });
}

export async function updateBooking(
  token: string,
  id: string,
  input: UpdateBookingInput,
): Promise<BookingRecord> {
  return apiRequest<BookingRecord>(`/bookings/${id}`, {
    token,
    method: 'PATCH',
    body: input,
  });
}

export async function deleteBooking(token: string, id: string): Promise<{ success: boolean }> {
  return apiRequest(`/bookings/${id}`, { token, method: 'DELETE' });
}

export async function cloneBooking(token: string, id: string): Promise<BookingRecord> {
  return apiRequest<BookingRecord>(`/bookings/${id}/clone`, { token, method: 'POST' });
}

export async function exportBookingCsv(token: string, query: BookingQuery = {}): Promise<string> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  });
  return apiRequest<string>(`/bookings/export/csv?${params}`, { token, raw: true });
}
