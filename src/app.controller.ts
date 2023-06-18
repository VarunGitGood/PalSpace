import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaService } from './kafka/kafka.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private kafka: KafkaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kafka')
  async kafkaTest() {
    await this.kafka.subscribeToTopic('testing');
    await this.kafka.consumeMessage();
    return 'Kafka test';
  }

  @Get('kafka1')
  async kafkaTest1() {
    await this.kafka.sendMessage('testing', 'Hello World! from kafka1');
    return 'Kafka test 1';
  }
}
