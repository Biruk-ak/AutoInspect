import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './entities/payments.entity';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
