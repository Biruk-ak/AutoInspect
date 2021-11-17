import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionReport } from './entities/inspections.entity';
import { InspectionService } from './inspections.service';
import { InspectionController } from './inspections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionReport])],
  controllers: [InspectionController],
  providers: [InspectionService],
  exports: [InspectionService],
})
export class InspectionModule {}
