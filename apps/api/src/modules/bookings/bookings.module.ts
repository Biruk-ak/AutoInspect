import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionBooking } from './entities/bookings.entity';
import { BookingService } from './bookings.service';
import { BookingController } from './bookings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionBooking])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
