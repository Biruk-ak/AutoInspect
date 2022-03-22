import { fetchDefectList, createDefect, updateDefect, deleteDefect } from '../defects';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('defects api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchDefectList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchDefectList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/defects?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createDefect posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createDefect('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/defects', expect.objectContaining({ method: 'POST' }));
  });

  it('updateDefect patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateDefect('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/defects/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteDefect deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteDefect('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/defects/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchDefectList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
