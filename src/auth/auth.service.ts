import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './utils/types';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async login(username: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      if (!user) {
        return Promise.resolve({
          message: 'Username does not exist',
        });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return Promise.resolve({
          message: 'Password is not valid',
        });
      }
      const token = this.jwtService.sign({ username });
      return Promise.resolve({
        message: 'success',
        token: token,
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error: error,
      });
    }
  }

  async register(data: UserDto): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });
      if (user) {
        return Promise.resolve({
          message: 'Username already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const payload = { ...data, password: hashedPassword };
      const newUser = await this.prisma.user.create({
        data: payload,
      });

      const token = this.jwtService.sign({ username: newUser.username });
      return Promise.resolve({
        message: 'success',
        token: token,
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error: error,
      });
    }
  }

  async me(req: Request): Promise<any> {
    const authUser: any = req['user'];
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: authUser.username,
        },
      });
      return Promise.resolve({
        message: 'success',
        user: user,
      });
    } catch (error) {
      return Promise.resolve({
        message: 'error',
        error: error,
      });
    }
  }

  async googleLogin(req: Request): Promise<any> {
    if (!req.user) {
      return 'No user from google';
    }
    console.log(req.user);

    return {
      user: req.user,
    };
  }
}
