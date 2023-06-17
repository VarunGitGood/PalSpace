import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisDbModule } from './redis-db/redis-db.module';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './queue_1/queue.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    RedisDbModule,
    EventsModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EventsGateway],
})
export class AppModule {}
