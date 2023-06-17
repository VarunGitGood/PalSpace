import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/utils/types';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded: User = await this.jwtService.verify(token);
        request.user = decoded;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    return false;
  }
}
