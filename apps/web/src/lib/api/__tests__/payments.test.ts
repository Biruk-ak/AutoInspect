import { fetchPaymentList, createPayment, updatePayment, deletePayment } from '../payments';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('payments api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchPaymentList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchPaymentList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/payments?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createPayment posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createPayment('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/payments', expect.objectContaining({ method: 'POST' }));
  });

  it('updatePayment patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updatePayment('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/payments/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deletePayment deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deletePayment('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/payments/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchPaymentList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
