import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectorProfile } from './entities/inspectors.entity';
import { InspectorService } from './inspectors.service';
import { InspectorController } from './inspectors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InspectorProfile])],
  controllers: [InspectorController],
  providers: [InspectorService],
  exports: [InspectorService],
})
export class InspectorModule {}
