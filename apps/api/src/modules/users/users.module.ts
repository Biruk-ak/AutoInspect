import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from './entities/users.entity';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
