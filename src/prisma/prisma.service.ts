import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(public User: User) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async createUser(data: User): Promise<User> {
    return this.user.create({ data });
  }

  async findUserById(uid: number): Promise<User | null> {
    return this.user.findUnique({ where: { uid } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.user.findUnique({ where: { email } });
  }

  async deleteUser(uid: number): Promise<User> {
    return this.user.delete({ where: { uid } });
  }
}
