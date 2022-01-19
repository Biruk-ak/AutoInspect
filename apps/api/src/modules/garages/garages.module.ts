import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GarageProfile } from './entities/garages.entity';
import { GarageService } from './garages.service';
import { GarageController } from './garages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GarageProfile])],
  controllers: [GarageController],
  providers: [GarageService],
  exports: [GarageService],
})
export class GarageModule {}
