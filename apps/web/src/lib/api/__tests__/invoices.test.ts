import { fetchInvoiceList, createInvoice, updateInvoice, deleteInvoice } from '../invoices';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('invoices api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchInvoiceList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInvoiceList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/invoices?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createInvoice posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createInvoice('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/invoices', expect.objectContaining({ method: 'POST' }));
  });

  it('updateInvoice patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateInvoice('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/invoices/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteInvoice deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteInvoice('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/invoices/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInvoiceList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
