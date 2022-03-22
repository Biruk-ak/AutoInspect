import { fetchChecklistList, createChecklist, updateChecklist, deleteChecklist } from '../checklists';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('checklists api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchChecklistList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchChecklistList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/checklists?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createChecklist posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createChecklist('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/checklists', expect.objectContaining({ method: 'POST' }));
  });

  it('updateChecklist patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateChecklist('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/checklists/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteChecklist deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteChecklist('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/checklists/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchChecklistList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
