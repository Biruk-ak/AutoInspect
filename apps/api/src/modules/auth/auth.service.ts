import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserAccount } from '../users/entities/users.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly users: Repository<UserAccount>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findOne({
      where: { externalRef: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      status: 'active',
      notes: dto.name,
      externalRef: dto.email,
      organizationId: dto.organizationId,
      metadata: { role: dto.role || 'customer', passwordHash },
      createdBy: 'system',
      updatedBy: 'system',
      version: 1,
      isActive: true,
      isDeleted: false,
      tags: [dto.role || 'customer'],
      priority: 50,
      locale: 'en',
      currency: 'USD',
      amount: 0,
      quantity: 1,
    });
    const saved = await this.users.save(user);
    return this.tokenResponse(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({
      where: { externalRef: dto.email, isDeleted: false },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const hash = String((user.metadata as any)?.passwordHash || '');
    const ok = await bcrypt.compare(dto.password, hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.tokenResponse(user);
  }

  private tokenResponse(user: UserAccount) {
    const role = String((user.metadata as any)?.role || 'customer');
    const payload = {
      sub: user.id,
      email: user.externalRef,
      role,
      organizationId: user.organizationId,
    };
    return {
      accessToken: this.jwt.sign(payload),
      user: {
        id: user.id,
        email: user.externalRef,
        role,
        organizationId: user.organizationId,
        name: user.notes || user.externalRef,
      },
    };
  }
}
