import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { User } from 'src/utils/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RedisDbService {
  private redis: Redis;
  constructor(
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {
    this.redis = this.redisService.getClient();
  }

  // push value to list with value: key
  push(key: string, value: string) {
    return this.redis.lpush(key, value);
  }

  // get value of any range with value: key
  getRange(key = 'queue', start = 0, end = -1) {
    return this.redis.lrange(key, start, end);
  }

  // adding user to queue
  addUserToQueue(username: User['username']) {
    this.redis.lpush('queue', username);
    return this.redis.lrange('queue', 0, -1);
  }

  // removing users from queue
  popUsers() {
    //  pop twice to get both users
    const users = [];
    users.push(this.redis.rpop('queue'));
    users.push(this.redis.rpop('queue'));
    return users;
  }
}
