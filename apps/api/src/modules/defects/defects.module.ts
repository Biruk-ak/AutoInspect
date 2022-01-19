import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleDefect } from './entities/defects.entity';
import { DefectService } from './defects.service';
import { DefectController } from './defects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleDefect])],
  controllers: [DefectController],
  providers: [DefectService],
  exports: [DefectService],
})
export class DefectModule {}
