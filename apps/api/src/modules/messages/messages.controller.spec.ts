import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';

describe('MessageController', () => {
  let controller: MessageController;
  let service: Record<string, jest.Mock>;

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue({ id: '1' }),
      bulkCreate: jest.fn().mockResolvedValue([]),
      findAll: jest.fn().mockResolvedValue({ items: [], total: 0 }),
      findOne: jest.fn().mockResolvedValue({ id: '1' }),
      update: jest.fn().mockResolvedValue({ id: '1' }),
      remove: jest.fn().mockResolvedValue({ success: true, id: '1' }),
      restore: jest.fn().mockResolvedValue({ id: '1' }),
      countByStatus: jest.fn().mockResolvedValue({}),
      getRecent: jest.fn().mockResolvedValue([]),
      exportCsv: jest.fn().mockResolvedValue('id\n'),
      healthCheck: jest.fn().mockResolvedValue({ ok: true, count: 0 }),
      clone: jest.fn().mockResolvedValue({ id: '2' }),
      attachMetadata: jest.fn().mockResolvedValue({ id: '1' }),
      setTags: jest.fn().mockResolvedValue({ id: '1' }),
      bulkUpdateStatus: jest.fn().mockResolvedValue(2),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [{ provide: MessageService, useValue: service }],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create', async () => {
    await controller.create({ status: 'draft' } as any, { id: 'u1' });
    expect(service.create).toHaveBeenCalled();
  });

  it('should list', async () => {
    await controller.findAll({} as any);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get one', async () => {
    await controller.findOne('11111111-1111-1111-1111-111111111111');
    expect(service.findOne).toHaveBeenCalled();
  });

  it('should update', async () => {
    await controller.update('11111111-1111-1111-1111-111111111111', { status: 'active' } as any, { id: 'u1' });
    expect(service.update).toHaveBeenCalled();
  });

  it('should remove', async () => {
    await controller.remove('11111111-1111-1111-1111-111111111111', { id: 'u1' });
    expect(service.remove).toHaveBeenCalled();
  });
});
