import { fetchBookingList, createBooking, updateBooking, deleteBooking } from '../bookings';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('bookings api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchBookingList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchBookingList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/bookings?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createBooking posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createBooking('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/bookings', expect.objectContaining({ method: 'POST' }));
  });

  it('updateBooking patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateBooking('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/bookings/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteBooking deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteBooking('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/bookings/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchBookingList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
