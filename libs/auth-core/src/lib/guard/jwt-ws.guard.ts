import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtTokenService } from '../jwt/jwt-token.service';
import { WsException } from '@nestjs/websockets';
import { Authorities, JwtPayload, ROLES_KEY } from '@eco-books/type-common';

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly tokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {

    const socket = context.switchToWs().getClient();
    const headers = socket.handshake.headers;
    const rawToken = headers['Authorization'];

    if(!rawToken) {
      throw new WsException('not exists token');
    }

    const split = rawToken.split(' ');

    if (split.length < 2) {
      throw new WsException('token is not Bearer');
    }
    const token = split[1];
    const payload: JwtPayload = this.tokenService.decodeAccessToken(token);

    const isExpired = this.tokenService.checkExpired(payload.exp);

    if(isExpired) {
      throw new HttpException('jwt-expired', 401);
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
