import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisDbService {
  private redis: Redis;
  constructor(private redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  push(key: string, value: string) {
    return this.redis.lpush(key, value);
  }
}
