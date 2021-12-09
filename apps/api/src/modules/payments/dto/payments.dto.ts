import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority?: number;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  externalRef?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  category?: string;

  @IsOptional()
  @IsUUID()
  relatedId?: string;

  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsUUID()
  garageId?: string;

  @IsOptional()
  @IsUUID()
  inspectorId?: string;

  @IsOptional()
  @IsUUID()
  bookingId?: string;

  @IsOptional()
  @IsUUID()
  inspectionId?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  notes?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority?: number;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  category?: string;
}

export class QueryPaymentDto {
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(200)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeDeleted?: boolean = false;

  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsUUID()
  garageId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}

export class PaymentResponseDto {
  id!: string;
  status!: string;
  notes?: string;
  metadata!: Record<string, unknown>;
  organizationId!: string;
  createdAt!: Date;
  updatedAt!: Date;
  isActive!: boolean;
  priority!: number;
  tags!: string[];
  amount?: number;
  currency?: string;
  externalRef?: string;
}

export class PaginatedPaymentResponseDto {
  items!: PaymentResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
  hasNext!: boolean;
  hasPrev!: boolean;
}

export class BulkCreatePaymentDto {
  @IsArray()
  @Type(() => CreatePaymentDto)
  items!: CreatePaymentDto[];
}

export class BulkUpdateStatusPaymentDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];

  @IsString()
  @MinLength(2)
  @MaxLength(64)
  status!: string;
}
