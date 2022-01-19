import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/messages.entity';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
