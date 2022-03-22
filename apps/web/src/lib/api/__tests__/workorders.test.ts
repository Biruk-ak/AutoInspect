import { fetchWorkOrderList, createWorkOrder, updateWorkOrder, deleteWorkOrder } from '../workorders';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('workorders api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchWorkOrderList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchWorkOrderList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/workorders?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createWorkOrder posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createWorkOrder('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/workorders', expect.objectContaining({ method: 'POST' }));
  });

  it('updateWorkOrder patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateWorkOrder('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/workorders/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteWorkOrder deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteWorkOrder('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/workorders/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchWorkOrderList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
