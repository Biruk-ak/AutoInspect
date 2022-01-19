import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneratedReport } from './entities/reports.entity';
import { ReportService } from './reports.service';
import { ReportController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GeneratedReport])],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
