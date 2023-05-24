import { Module } from '@nestjs/common';
import { RedisServiceInit } from './redis.service';

@Module({
  providers: [RedisServiceInit],
  exports: [RedisServiceInit],
})
export class RedisModule {}
