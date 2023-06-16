import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @Get()
  init(): string {
    return 'Hello from NestJS';
  }
  @Get('produce')
  async sendQueue(): Promise<string> {
    this.rabbitmqService.send('RABBIT_SERVICE', {
      message: 'Hello from NestJS',
    });
    return 'Message Sent To queue testqueue';
  }

  @MessagePattern('RABBIT_SERVICE')
  public async messageHandler(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log('Data Received from queue testqueue', data);
    channel.ack(originalMsg);
  }
}
