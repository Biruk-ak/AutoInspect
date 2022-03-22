import { fetchVehicleList, createVehicle, updateVehicle, deleteVehicle } from '../vehicles';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('vehicles api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchVehicleList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchVehicleList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/vehicles?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createVehicle posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createVehicle('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/vehicles', expect.objectContaining({ method: 'POST' }));
  });

  it('updateVehicle patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateVehicle('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/vehicles/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteVehicle deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteVehicle('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/vehicles/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchVehicleList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
