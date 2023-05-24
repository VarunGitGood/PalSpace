import { Module } from '@nestjs/common';
import { RedisDbService } from './redis-db.service';

@Module({
  providers: [RedisDbService],
  exports: [RedisDbService],
})
export class RedisDbModule {}
