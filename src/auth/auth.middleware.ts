import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let token;
    if (
      req.headers.authorization ||
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];

        // decodes token id and verify
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        const user = await this.prisma.user.findUnique({
          where: {
            email: decoded.email,
          },
        });

        if (!user) {
          res.status(401);
          throw new Error('Not Authorized, token Failed');
        }
        req['user'] = user;

        next();
      } catch (err) {
        res.status(401);
        throw new Error('Not Authorized, token Failed');
      }
    }
  }
}
