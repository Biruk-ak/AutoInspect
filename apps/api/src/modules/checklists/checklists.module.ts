import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionChecklist } from './entities/checklists.entity';
import { ChecklistService } from './checklists.service';
import { ChecklistController } from './checklists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionChecklist])],
  controllers: [ChecklistController],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
