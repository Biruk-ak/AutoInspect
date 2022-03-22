import { fetchCustomerList, createCustomer, updateCustomer, deleteCustomer } from '../customers';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('customers api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchCustomerList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchCustomerList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/customers?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createCustomer posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createCustomer('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/customers', expect.objectContaining({ method: 'POST' }));
  });

  it('updateCustomer patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateCustomer('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/customers/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteCustomer deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteCustomer('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/customers/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchCustomerList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
