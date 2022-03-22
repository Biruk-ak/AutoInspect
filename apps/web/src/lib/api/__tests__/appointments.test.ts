import { fetchAppointmentList, createAppointment, updateAppointment, deleteAppointment } from '../appointments';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('appointments api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchAppointmentList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchAppointmentList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/appointments?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createAppointment posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createAppointment('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/appointments', expect.objectContaining({ method: 'POST' }));
  });

  it('updateAppointment patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateAppointment('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/appointments/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteAppointment deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteAppointment('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/appointments/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchAppointmentList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
