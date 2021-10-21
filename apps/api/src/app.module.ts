import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './health.controller';
import { InspectionModule } from './modules/inspections/inspections.module';
import { PhotoModule } from './modules/photos/photos.module';
import { CertificateModule } from './modules/certificates/certificates.module';
import { BookingModule } from './modules/bookings/bookings.module';
import { PaymentModule } from './modules/payments/payments.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { VehicleModule } from './modules/vehicles/vehicles.module';
import { UserModule } from './modules/users/users.module';
import { GarageModule } from './modules/garages/garages.module';
import { InspectorModule } from './modules/inspectors/inspectors.module';
import { CustomerModule } from './modules/customers/customers.module';
import { NotificationModule } from './modules/notifications/notifications.module';
import { DocumentModule } from './modules/documents/documents.module';
import { ReviewModule } from './modules/reviews/reviews.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { ReportModule } from './modules/reports/reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { SettingsModule } from './modules/settings/settings.module';
import { MessageModule } from './modules/messages/messages.module';
import { AppointmentModule } from './modules/appointments/appointments.module';
import { WorkOrderModule } from './modules/workorders/workorders.module';
import { InvoiceModule } from './modules/invoices/invoices.module';
import { SubscriptionModule } from './modules/subscriptions/subscriptions.module';
import { RegionModule } from './modules/regions/regions.module';
import { ChecklistModule } from './modules/checklists/checklists.module';
import { DefectModule } from './modules/defects/defects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER || 'autoinspect',
      password: process.env.DATABASE_PASSWORD || 'autoinspect',
      database: process.env.DATABASE_NAME || 'autoinspect',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    InspectionModule,
    PhotoModule,
    CertificateModule,
    BookingModule,
    PaymentModule,
    MaintenanceModule,
    AnalyticsModule,
    VehicleModule,
    UserModule,
    GarageModule,
    InspectorModule,
    CustomerModule,
    NotificationModule,
    DocumentModule,
    ReviewModule,
    InventoryModule,
    SchedulingModule,
    ComplianceModule,
    InsuranceModule,
    ReportModule,
    AuditModule,
    SettingsModule,
    MessageModule,
    AppointmentModule,
    WorkOrderModule,
    InvoiceModule,
    SubscriptionModule,
    RegionModule,
    ChecklistModule,
    DefectModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
