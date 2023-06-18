import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnApplicationShutdown {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'my-app',
      brokers: ['localhost:29092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'test-group' });
    await this.producer.connect();
    await this.consumer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async connect() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
    } catch (error) {
      console.error(error);
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
    } catch (error) {
      console.error(error);
    }
  }

  async sendMessage(topic = 'testing', message: string) {
    try {
      await this.producer.send({
        topic: topic,
        messages: [{ value: message }],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async subscribeToTopic(topic = 'testing') {
    try {
      await this.consumer.subscribe({ topic: topic });
    } catch (error) {
      console.error(error);
    }
  }

  async consumeMessage() {
    try {
      await this.consumer.run({
        eachMessage: async ({ partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value.toString(),
          });
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
