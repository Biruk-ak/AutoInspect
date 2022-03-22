import { fetchPhotoList, createPhoto, updatePhoto, deletePhoto } from '../photos';

jest.mock('../client', () => ({
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../client';

const mocked = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('photos api client', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('fetchPhotoList builds query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchPhotoList('tok', { page: 2, status: 'active' });
    expect(mocked).toHaveBeenCalledWith(expect.stringContaining('/photos?'), expect.objectContaining({ token: 'tok' }));
  });

  it('createPhoto posts body', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await createPhoto('tok', { status: 'draft' });
    expect(mocked).toHaveBeenCalledWith('/photos', expect.objectContaining({ method: 'POST' }));
  });

  it('updatePhoto patches', async () => {
    mocked.mockResolvedValue({ id: '1' });
    await updatePhoto('tok', '1', { status: 'active' });
    expect(mocked).toHaveBeenCalledWith('/photos/1', expect.objectContaining({ method: 'PATCH' }));
  });

  it('deletePhoto deletes', async () => {
    mocked.mockResolvedValue({ success: true });
    await deletePhoto('tok', '1');
    expect(mocked).toHaveBeenCalledWith('/photos/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles empty query', async () => {
    mocked.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20, totalPages: 0, hasNext: false, hasPrev: false });
    await fetchPhotoList('tok');
    expect(mocked).toHaveBeenCalled();
  });
});
