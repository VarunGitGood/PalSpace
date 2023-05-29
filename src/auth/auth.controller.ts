import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto, SignInDto } from './utils/types';
import { RedisDbService } from 'src/redis-db/redis-db.service';
import { Request } from 'express';
import { AuthenticationGuard } from './guards/auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private redis: RedisDbService,
  ) {}
  @ApiResponse({ status: 201, description: 'Login Token' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('login')
  async login(@Body() siginDto: SignInDto) {
    return this.authService.login(siginDto.username, siginDto.password);
  }

  @ApiResponse({ status: 201, description: 'Register Token' })
  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthenticationGuard)
  async me(@Req() req: Request) {
    return this.authService.me(req);
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('test')
  async test() {
    return this.redis.push('lmao', 'no');
  }
}
