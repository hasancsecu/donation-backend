import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1];
      try {
        const decoded = await this.jwtService.verifyAsync(token);
        req['user'] = decoded;
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }
    next();
  }
}
