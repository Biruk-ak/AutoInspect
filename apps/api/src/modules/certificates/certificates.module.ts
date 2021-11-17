import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleCertificate } from './entities/certificates.entity';
import { CertificateService } from './certificates.service';
import { CertificateController } from './certificates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleCertificate])],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
