import { fetchDocumentList, createDocument, updateDocument, deleteDocument } from '../documents';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('documents api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchDocumentList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchDocumentList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/documents?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createDocument posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createDocument('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/documents', expect.objectContaining({ method: 'POST' }));
  });

  it('updateDocument patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updateDocument('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/documents/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deleteDocument deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deleteDocument('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/documents/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchDocumentList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
