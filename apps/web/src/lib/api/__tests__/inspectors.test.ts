import { fetchInspectorList, createInspector, updateInspector, deleteInspector } from '../inspectors';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('inspectors api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchInspectorList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInspectorList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/inspectors?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createInspector posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createInspector('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/inspectors', expect.objectContaining({ method: 'POST' }));
  });

  it('updateInspector patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateInspector('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/inspectors/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteInspector deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteInspector('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/inspectors/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchInspectorList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
