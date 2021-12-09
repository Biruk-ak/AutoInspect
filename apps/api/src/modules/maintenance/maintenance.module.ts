import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRecord } from './entities/maintenance.entity';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRecord])],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
