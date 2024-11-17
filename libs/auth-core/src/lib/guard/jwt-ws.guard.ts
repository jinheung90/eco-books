import { CanActivate, ExecutionContext, HttpException, Injectable, Logger, UseFilters } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtTokenService } from '../jwt/jwt-token.service';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Authorities, JwtPayload, ROLES_KEY } from '@eco-books/type-common';
import { logger } from 'nx/src/utils/logger';

@Injectable()
export class JwtWsGuard implements CanActivate {
  private logger = new Logger(JwtWsGuard.name);
  constructor(private reflector: Reflector, private readonly tokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {

    const socket = context.switchToWs().getClient();
    const headers = socket.handshake.headers;
    const rawToken = headers['authorization'];

    if(!rawToken) {
      this.logger.log('not exists token');
      throw new WsException('not exists token');
    }

    const split = rawToken.split(' ');

    if (split.length < 2) {
      this.logger.log('token is not Bearer');
      throw new WsException('token is not Bearer');
    }
    const token = split[1];
    const payload: JwtPayload = this.tokenService.decodeAccessToken(token);

    if(!payload) {
      this.logger.log('payload is null');
      throw new WsException('payload is null');
    }

    const isExpired = this.tokenService.checkExpired(payload.exp);

    if(isExpired) {
      this.logger.log('jwt-expired');
      throw new WsException('jwt-expired');
    }

    socket.user = payload;

    const requiredRoles = this.reflector.getAllAndOverride<Authorities[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.some((role) => payload.authorities.includes(role));
  }
}
