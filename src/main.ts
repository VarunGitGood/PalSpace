import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  // ------------------------SWAGGER----------------------------
  const config = new DocumentBuilder()
    .setTitle('PalSpace Backend')
    .setDescription('PalSpace Backend API description')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // -------------------RabbitMQ------------------------------

  const USER = configService.get<string>('RABBITMQ_USER');
  const PASSWORD = configService.get<string>('RABBITMQ_PASSWORD');
  const HOST = configService.get<string>('RABBITMQ_HOST');
  const QUEUE = configService.get<string>('RABBITMQ_QUEUE');

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      // urls: ['amqp://localhost:5672'],
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
