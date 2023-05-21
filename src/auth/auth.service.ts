import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  signIn(username: string, password: string): Promise<any> {
    if (username === 'admin' && password === 'admin') {
      const token = this.jwtService.sign({ username });
      return Promise.resolve({
        message: 'success',
        token: token,
      });
    } else {
      return Promise.resolve(null);
    }
  }

  async createUser(data: User): Promise<any> {
    const user = await this.prisma.user.create({
      data: data,
    });
    console.log(user);
    return Promise.resolve({
      message: 'success',
      user: user,
    });
  }
}
