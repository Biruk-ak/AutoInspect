import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inspections')
@Index(['organizationId', 'status'])
@Index(['createdAt'])
@Index(['externalRef'])
export class InspectionReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
  @Column({ nullable: true })
  status?: string;
  @Column({ nullable: true })
  notes?: string;
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, unknown>;
  @Column({ nullable: true })
  organizationId?: string;
  @Column({ nullable: true })
  createdBy?: string;
  @Column({ nullable: true })
  updatedBy?: string;
  @Column({ type: 'decimal', default: 0 })
  version!: number;
  @Column({ default: true })
  isActive!: boolean;
  @Column({ default: false })
  isDeleted!: boolean;
  @DeleteDateColumn()
  deletedAt!: Date | null;
  @Column({ nullable: true })
  externalRef?: string;
  @Column({ type: 'decimal', default: 0 })
  priority!: number;
  @Column({ type: 'simple-array', default: '' })
  tags!: string[];
  @Column({ nullable: true })
  locale?: string;
  @Column({ nullable: true })
  currency?: string;
  @Column({ type: 'decimal', default: 0 })
  amount!: number;
  @Column({ type: 'decimal', default: 0 })
  quantity!: number;
  @Column({ nullable: true })
  vehicleId?: string;
  @Column({ nullable: true })
  inspectorId?: string;
  @Column({ nullable: true })
  garageId?: string;
  @Column({ type: 'decimal', nullable: true })
  score?: number;
  @Column({ default: false })
  passed!: boolean;
  @Column({ nullable: true })
  inspectionType?: string;
  @Column({ type: 'decimal', nullable: true })
  odometer?: number;
  @Column({ nullable: true })
  vin?: string;

  summarize(): Record<string, unknown> {
    return {
      id: this.id,
      status: this.status,
      organizationId: this.organizationId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      priority: this.priority,
      tags: this.tags,
    };
  }

  softDeactivate(userId: string): void {
    this.isActive = false;
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.updatedBy = userId;
    this.version = (this.version || 0) + 1;
  }

  activate(userId: string): void {
    this.isActive = true;
    this.isDeleted = false;
    this.deletedAt = null;
    this.updatedBy = userId;
    this.version = (this.version || 0) + 1;
  }

  applyMetadata(patch: Record<string, unknown>): void {
    this.metadata = { ...(this.metadata || {}), ...patch };
    this.updatedAt = new Date();
    this.version = (this.version || 0) + 1;
  }

  addTag(tag: string): void {
    const current = this.tags || [];
    if (!current.includes(tag)) {
      this.tags = [...current, tag];
    }
  }

  removeTag(tag: string): void {
    this.tags = (this.tags || []).filter((t) => t !== tag);
  }

  setPriority(level: number): void {
    if (level < 0 || level > 100) {
      throw new Error('Priority must be between 0 and 100');
    }
    this.priority = level;
  }

  toPublicDto(): Record<string, unknown> {
    return {
      ...this.summarize(),
      notes: this.notes,
      locale: this.locale,
      currency: this.currency,
      amount: this.amount,
      quantity: this.quantity,
      externalRef: this.externalRef,
    };
  }
}
