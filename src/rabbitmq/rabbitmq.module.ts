import { Module } from '@nestjs/common';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  controllers: [RabbitmqController],
  providers: [RabbitmqService]
})
export class RabbitmqModule {}
