import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { EventsGateway } from 'src/events/events.gateway';
import { RedisDbService } from 'src/redis-db/redis-db.service';

@Module({
  imports: [EventsGateway, RedisDbService],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}
