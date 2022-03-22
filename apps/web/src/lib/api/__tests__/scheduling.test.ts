import { fetchSchedulingList, createScheduling, updateScheduling, deleteScheduling } from '../scheduling';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('scheduling api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchSchedulingList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchSchedulingList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/scheduling?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createScheduling posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createScheduling('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/scheduling', expect.objectContaining({ method: 'POST' }));
  });

  it('updateScheduling patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateScheduling('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/scheduling/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteScheduling deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteScheduling('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/scheduling/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchSchedulingList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
