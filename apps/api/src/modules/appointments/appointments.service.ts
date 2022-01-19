import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Repository,
} from 'typeorm';
import { AppointmentSlot } from './entities/appointments.entity';
import {
  BulkCreateAppointmentDto,
  BulkUpdateStatusAppointmentDto,
  CreateAppointmentDto,
  PaginatedAppointmentResponseDto,
  QueryAppointmentDto,
  UpdateAppointmentDto,
} from './dto/appointments.dto';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectRepository(AppointmentSlot)
    private readonly repository: Repository<AppointmentSlot>,
  ) {}

  async create(dto: CreateAppointmentDto, userId: string): Promise<AppointmentSlot> {
    this.logger.log(`Creating appointments by ${userId}`);
    const entity = this.repository.create({
      ...dto,
      status: dto.status || 'draft',
      createdBy: userId,
      updatedBy: userId,
      version: 1,
      isActive: dto.isActive ?? true,
      isDeleted: false,
      metadata: dto.metadata || {},
      tags: dto.tags || [],
      priority: dto.priority ?? 50,
      locale: dto.locale || 'en',
      currency: dto.currency || 'USD',
      amount: dto.amount ?? 0,
      quantity: dto.quantity ?? 1,
    });
    const saved = await this.repository.save(entity);
    this.logger.debug(`Created appointments ${saved.id}`);
    return saved;
  }

  async bulkCreate(dto: BulkCreateAppointmentDto, userId: string): Promise<AppointmentSlot[]> {
    if (!dto.items?.length) {
      throw new BadRequestException('items array cannot be empty');
    }
    if (dto.items.length > 500) {
      throw new BadRequestException('Cannot create more than 500 items at once');
    }
    const results: AppointmentSlot[] = [];
    for (const item of dto.items) {
      results.push(await this.create(item, userId));
    }
    return results;
  }

  async findAll(query: QueryAppointmentDto): Promise<PaginatedAppointmentResponseDto> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 200);
    const where: FindOptionsWhere<AppointmentSlot> = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.status) where.status = query.status;
    if (query.vehicleId) (where as any).vehicleId = query.vehicleId;
    if (query.customerId) (where as any).customerId = query.customerId;
    if (query.garageId) (where as any).garageId = query.garageId;
    if (!query.includeDeleted) where.isDeleted = false;

    const qb = this.repository.createQueryBuilder('appointments');
    qb.where(where);

    if (query.search) {
      qb.andWhere(
        '(appointments.notes ILIKE :search OR appointments.externalRef ILIKE :search OR appointments.status ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.from && query.to) {
      qb.andWhere('appointments.createdAt BETWEEN :from AND :to', {
        from: query.from,
        to: query.to,
      });
    }

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(`appointments.${sortBy}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((i) => i.toPublicDto() as any),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<AppointmentSlot> {
    const entity = await this.repository.findOne({ where: { id, isDeleted: false } });
    if (!entity) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }
    return entity;
  }

  async update(id: string, dto: UpdateAppointmentDto, userId: string): Promise<AppointmentSlot> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    entity.updatedBy = userId;
    entity.version = (entity.version || 0) + 1;
    return this.repository.save(entity);
  }

  async remove(id: string, userId: string): Promise<{ success: boolean; id: string }> {
    const entity = await this.findOne(id);
    entity.softDeactivate(userId);
    await this.repository.save(entity);
    return { success: true, id };
  }

  async restore(id: string, userId: string): Promise<AppointmentSlot> {
    const entity = await this.repository.findOne({ where: { id }, withDeleted: true });
    if (!entity) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }
    entity.activate(userId);
    return this.repository.save(entity);
  }

  async bulkUpdateStatus(dto: BulkUpdateStatusAppointmentDto, userId: string): Promise<number> {
    if (!dto.ids?.length) {
      throw new BadRequestException('ids required');
    }
    const result = await this.repository.update(
      { id: In(dto.ids) },
      { status: dto.status, updatedBy: userId },
    );
    return result.affected || 0;
  }

  async countByStatus(organizationId?: string): Promise<Record<string, number>> {
    const qb = this.repository
      .createQueryBuilder('appointments')
      .select('appointments.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('appointments.isDeleted = false')
      .groupBy('appointments.status');
    if (organizationId) {
      qb.andWhere('appointments.organizationId = :organizationId', { organizationId });
    }
    const rows = await qb.getRawMany();
    return rows.reduce((acc: Record<string, number>, row) => {
      acc[row.status] = Number(row.count);
      return acc;
    }, {});
  }

  async getRecent(limit = 10, organizationId?: string): Promise<AppointmentSlot[]> {
    return this.repository.find({
      where: {
        isDeleted: false,
        ...(organizationId ? { organizationId } : {}),
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async searchByTags(tags: string[], organizationId?: string): Promise<AppointmentSlot[]> {
    const qb = this.repository.createQueryBuilder('appointments');
    qb.where('appointments.isDeleted = false');
    if (organizationId) {
      qb.andWhere('appointments.organizationId = :organizationId', { organizationId });
    }
    for (let i = 0; i < tags.length; i++) {
      qb.andWhere(`appointments.tags LIKE :tag${i}`, { [`tag${i}`]: `%${tags[i]}%` });
    }
    return qb.getMany();
  }

  async exportCsv(query: QueryAppointmentDto): Promise<string> {
    const result = await this.findAll({ ...query, limit: 200, page: 1 });
    const header = ['id', 'status', 'organizationId', 'createdAt', 'amount', 'priority'];
    const lines = [header.join(',')];
    for (const item of result.items) {
      lines.push(
        [
          item.id,
          item.status,
          item.organizationId,
          item.createdAt,
          item.amount ?? 0,
          item.priority,
        ].join(','),
      );
    }
    return lines.join('\n');
  }

  async clone(id: string, userId: string): Promise<AppointmentSlot> {
    const source = await this.findOne(id);
    const clone = this.repository.create({
      ...source,
      id: undefined as any,
      status: 'draft',
      createdBy: userId,
      updatedBy: userId,
      version: 1,
      externalRef: source.externalRef ? `${source.externalRef}-copy` : undefined,
      createdAt: undefined as any,
      updatedAt: undefined as any,
    });
    return this.repository.save(clone);
  }

  async attachMetadata(id: string, patch: Record<string, unknown>, userId: string): Promise<AppointmentSlot> {
    const entity = await this.findOne(id);
    entity.applyMetadata(patch);
    entity.updatedBy = userId;
    return this.repository.save(entity);
  }

  async setTags(id: string, tags: string[], userId: string): Promise<AppointmentSlot> {
    const entity = await this.findOne(id);
    entity.tags = Array.from(new Set(tags.map((t) => t.trim()).filter(Boolean)));
    entity.updatedBy = userId;
    entity.version = (entity.version || 0) + 1;
    return this.repository.save(entity);
  }

  async healthCheck(): Promise<{ ok: boolean; count: number }> {
    const count = await this.repository.count({ where: { isDeleted: false } });
    return { ok: true, count };
  }
}
