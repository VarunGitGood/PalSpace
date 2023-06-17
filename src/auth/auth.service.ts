import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from '../utils/types';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async verifyWsConnection(token: string): Promise<any> {
    const decoded = await this.jwtService.verify(token);
    const user = decoded;
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = this.jwtService.sign({ username });
    return {
      message: 'success',
      token: token,
    };
  }

  async register(data: UserDto): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const peerUID = uuid();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const payload = { ...data, password: hashedPassword, peerID: peerUID };
    const newUser = await this.prisma.user.create({
      data: payload,
    });

    const token = this.jwtService.sign({ username: newUser.username });
    return {
      message: 'User created successfully',
      token: token,
    };
  }

  async me(req: Request): Promise<any> {
    const authUser: any = req['user'];
    const user = await this.prisma.user.findUnique({
      where: {
        username: authUser.username,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return {
      message: 'success',
      user: user,
    };
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

  async logout(req: Request): Promise<any> {
    delete req['user'];
    return {
      message: 'Logged out successfully',
    };
  }
}
