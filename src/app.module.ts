import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisServiceInit } from './redis/redis.service';
import { RedisDbModule } from './redis-db/redis-db.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    RedisDbModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RedisServiceInit],
})
export class AppModule {}
