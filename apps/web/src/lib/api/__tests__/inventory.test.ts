import { fetchInventoryList, createInventory, updateInventory, deleteInventory } from '../inventory';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('inventory api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchInventoryList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInventoryList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/inventory?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createInventory posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createInventory('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/inventory', expect.objectContaining({ method: 'POST' }));
  });

  it('updateInventory patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateInventory('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/inventory/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteInventory deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteInventory('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/inventory/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInventoryList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
