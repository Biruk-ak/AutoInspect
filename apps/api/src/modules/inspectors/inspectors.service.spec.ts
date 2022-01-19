import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InspectorService } from './inspectors.service';
import { InspectorProfile } from './entities/inspectors.entity';

describe('InspectorService', () => {
  let service: InspectorService;
  let repository: Record<string, jest.Mock>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InspectorService,
        { provide: getRepositoryToken(InspectorProfile), useValue: repository },
      ],
    }).compile();

    service = module.get<InspectorService>(InspectorService);
  });

  it('should be defined', async () => {expect(service).toBeDefined();
  });
  it('should create a record', async () => {
    const dto = { status: 'draft', notes: 'test', organizationId: 'org-1' };
    repository.create.mockReturnValue({ id: '1', ...dto });
    repository.save.mockResolvedValue({ id: '1', ...dto, toPublicDto: () => dto });
    const result = await service.create(dto as any, 'user-1');
    expect(result.id).toBe('1');
    expect(repository.save).toHaveBeenCalled();

  });
  it('should throw when bulk create is empty', async () => {
    await expect(service.bulkCreate({ items: [] } as any, 'user-1')).rejects.toThrow();

  });
  it('should throw when bulk create exceeds limit', async () => {
    const items = Array.from({ length: 501 }, () => ({ status: 'draft' }));
    await expect(service.bulkCreate({ items } as any, 'user-1')).rejects.toThrow();

  });
  it('should find one or throw', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow();

  });
  it('should update record', async () => {
    const entity = {
      id: '1',
      status: 'draft',
      version: 1,
      softDeactivate: jest.fn(),
      activate: jest.fn(),
      applyMetadata: jest.fn(),
      toPublicDto: () => ({ id: '1' }),
    };
    repository.findOne.mockResolvedValue(entity);
    repository.save.mockImplementation(async (e) => e);
    const result = await service.update('1', { status: 'active' } as any, 'user-1');
    expect(result.status).toBe('active');

  });
  it('should soft remove', async () => {
    const entity = {
      id: '1',
      softDeactivate: jest.fn(),
      version: 1,
    };
    repository.findOne.mockResolvedValue(entity);
    repository.save.mockResolvedValue(entity);
    const result = await service.remove('1', 'user-1');
    expect(result.success).toBe(true);
    expect(entity.softDeactivate).toHaveBeenCalledWith('user-1');

  });
  it('should count by status', async () => {
    const qb: any = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([{ status: 'draft', count: '3' }]),
    };
    repository.createQueryBuilder.mockReturnValue(qb);
    const result = await service.countByStatus('org-1');
    expect(result.draft).toBe(3);

  });
  it('should export csv', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue({
      items: [{ id: '1', status: 'draft', organizationId: 'o', createdAt: new Date(), amount: 10, priority: 1 }],
      total: 1, page: 1, limit: 20, totalPages: 1, hasNext: false, hasPrev: false,
    } as any);
    const csv = await service.exportCsv({} as any);
    expect(csv).toContain('id,status');
    expect(csv).toContain('1');

  });
  it('should health check', async () => {
    repository.count.mockResolvedValue(42);
    const result = await service.healthCheck();
    expect(result).toEqual({ ok: true, count: 42 });

  });
  it('should set tags', async () => {
    const entity = { id: '1', tags: [], version: 1 };
    repository.findOne.mockResolvedValue(entity);
    repository.save.mockImplementation(async (e) => e);
    const result = await service.setTags('1', ['a', 'a', ' b '], 'user-1');
    expect(result.tags).toEqual(['a', 'b']);

  });
  it('should attach metadata', async () => {
    const entity = {
      id: '1',
      applyMetadata: jest.fn(),
      version: 1,
    };
    repository.findOne.mockResolvedValue(entity);
    repository.save.mockResolvedValue(entity);
    await service.attachMetadata('1', { foo: 'bar' }, 'user-1');
    expect(entity.applyMetadata).toHaveBeenCalledWith({ foo: 'bar' });

  });
  it('should handle scenario 1 for inspectors', async () => {
    repository.find.mockResolvedValue([]);
    repository.count.mockResolvedValue(1);
    const health = await service.healthCheck();
    expect(health.count).toBe(1);

  });
  it('should handle scenario 2 for inspectors', async () => {
    repository.find.mockResolvedValue([]);
    repository.count.mockResolvedValue(2);
    const health = await service.healthCheck();
    expect(health.count).toBe(2);

  });
  it('should handle scenario 3 for inspectors', async () => {
    repository.find.mockResolvedValue([]);
    repository.count.mockResolvedValue(3);
    const health = await service.healthCheck();
    expect(health.count).toBe(3);

  });
  it('should handle scenario 4 for inspectors', async () => {
    repository.find.mockResolvedValue([]);
    repository.count.mockResolvedValue(4);
    const health = await service.healthCheck();
    expect(health.count).toBe(4);

  });
  it('should handle scenario 5 for inspectors', async () => {
    repository.find.mockResolvedValue([]);
    repository.count.mockResolvedValue(5);
    const health = await service.healthCheck();
    expect(health.count).toBe(5);

  });
});
