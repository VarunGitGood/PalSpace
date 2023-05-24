import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './utils/types';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import qs from 'qs';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  createToken(email: string) {
    const payload = { email };
    // const token = this.jwtService.sign(payload, { expiresIn: '30d' });
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30d',
    });
    return token;
  }

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
      const token = this.createToken(user.email);
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

      const token = this.createToken(newUser.email);

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

  async getGoogleOAuthTokens({ code }: { code: string }) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/auth/google',
      grant_type: 'authorization_code',
    };

    try {
      const { data } = await axios.post(url, qs.stringify(values), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return data;
    } catch (error: any) {
      return Promise.resolve({
        message: 'error',
        error: error,
      });
    }
  }

  async googleLoginCallback(code: string, res: Response) {
    const data = await this.getGoogleOAuthTokens({ code });
    const { id_token } = data;
    const decodedUser: any = this.jwtService.decode(id_token);
    const token = this.createToken(decodedUser.email);
    const user = await this.prisma.user.findUnique({
      where: {
        email: decodedUser.email,
      },
    });
    if (user) {
      res
        .status(201)
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 30,
        })
        .send(user);
      return;
    }
    const newUser = await this.prisma.user.create({
      data: {
        email: decodedUser.email,
        username: decodedUser.email,
        password: 'google',
      },
    });
    res
      .status(202)
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      })
      .send(newUser);
    return;
  }

  async me(req: Request, res: Response) {
    if (req['user']) {
      const user = await this.prisma.user.findUnique({
        where: {
          email: req['user'].email,
        },
      });
      res.status(200).send(user);
    }
  }
}
