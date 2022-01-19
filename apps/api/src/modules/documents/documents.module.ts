import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentFile } from './entities/documents.entity';
import { DocumentService } from './documents.service';
import { DocumentController } from './documents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentFile])],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
