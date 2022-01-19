import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderTicket } from './entities/workorders.entity';
import { WorkOrderService } from './workorders.service';
import { WorkOrderController } from './workorders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrderTicket])],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
  exports: [WorkOrderService],
})
export class WorkOrderModule {}
