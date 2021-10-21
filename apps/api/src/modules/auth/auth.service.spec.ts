import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserAccount } from '../users/entities/users.entity';

describe('AuthService', () => {
  let service: AuthService;
  const users = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const jwt = { sign: jest.fn().mockReturnValue('token') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserAccount), useValue: users },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register creates user', async () => {
    users.findOne.mockResolvedValue(null);
    users.create.mockImplementation((v) => v);
    users.save.mockResolvedValue({
      id: '1',
      externalRef: 'a@b.com',
      organizationId: 'org',
      notes: 'A',
      metadata: { role: 'customer' },
    });
    const result = await service.register({
      email: 'a@b.com',
      password: 'password1',
      name: 'A',
      organizationId: 'org',
    } as any);
    expect(result.accessToken).toBe('token');
  });

  it('login rejects missing user', async () => {
    users.findOne.mockResolvedValue(null);
    await expect(
      service.login({ email: 'a@b.com', password: 'password1' } as any),
    ).rejects.toThrow();
  });
});
