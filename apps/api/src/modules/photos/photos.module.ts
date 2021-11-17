import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectionPhoto } from './entities/photos.entity';
import { PhotoService } from './photos.service';
import { PhotoController } from './photos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InspectionPhoto])],
  controllers: [PhotoController],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}
