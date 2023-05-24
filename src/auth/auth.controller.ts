import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto, SignInDto } from './utils/types';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() siginDto: SignInDto) {
    return this.authService.login(siginDto.username, siginDto.password);
  }
  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.authService.register(userDto);
  }
  @Post('google')
  async googleLoginCallback(@Body('code') code: string, @Res() res: Response) {
    return this.authService.googleLoginCallback(code, res);
  }
  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    return this.authService.me(req, res);
  }
}
