import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './utils/types';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signIn')
  async signIn(@Body() siginDto: signInDto) {
    return this.authService.signIn(siginDto.username, siginDto.password);
  }

  @Post('createUser')
  async createUser(@Body() userDto: any) {
    return this.authService.createUser(userDto);
  }
}
