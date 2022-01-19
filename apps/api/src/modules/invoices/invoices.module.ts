import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceDocument } from './entities/invoices.entity';
import { InvoiceService } from './invoices.service';
import { InvoiceController } from './invoices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceDocument])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
