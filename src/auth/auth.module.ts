import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './utils/constants';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisDbModule } from 'src/redis-db/redis-db.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    PrismaModule,
    RedisDbModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
