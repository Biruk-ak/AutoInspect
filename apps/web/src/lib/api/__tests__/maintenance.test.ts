import { fetchMaintenanceList, createMaintenance, updateMaintenance, deleteMaintenance } from '../maintenance';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('maintenance api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchMaintenanceList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchMaintenanceList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/maintenance?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createMaintenance posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createMaintenance('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/maintenance', expect.objectContaining({ method: 'POST' }));
  });

  it('updateMaintenance patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateMaintenance('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/maintenance/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteMaintenance deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteMaintenance('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/maintenance/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchMaintenanceList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
