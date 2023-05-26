import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto, SignInDto } from './utils/types';
import { RedisDbService } from 'src/redis-db/redis-db.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private redis: RedisDbService,
  ) {}
  @Post('login')
  async login(@Body() siginDto: SignInDto) {
    return this.authService.login(siginDto.username, siginDto.password);
  }

  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @Get('test')
  async test() {
    return this.redis.push('lmao', 'no');
  }
}
