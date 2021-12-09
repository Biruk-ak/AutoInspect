import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsSnapshot } from './entities/analytics.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsSnapshot])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
