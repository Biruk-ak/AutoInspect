import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRegion } from './entities/regions.entity';
import { RegionService } from './regions.service';
import { RegionController } from './regions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRegion])],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
