import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtTokenService } from '../jwt/jwt-token.service';
import { Authorities, JwtPayload, ROLES_KEY } from '@eco-books/type-common';

@Injectable()
export class JwtApiGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly tokenService: JwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const rawToken = headers['Authorization'];

    if(!rawToken) {
      throw new HttpException('not exists token', 401);
    }

    const split = rawToken.split(' ');

    if (split.length < 2) {
      throw new HttpException('token is not Bearer', 401);
    }

    const token = split[1];
    const payload: JwtPayload = this.tokenService.decodeAccessToken(token);

    const isExpired = this.tokenService.checkExpired(payload.exp);

    if(isExpired) {
      throw new HttpException('jwt-expired', 401);
    }

    request.user = payload;
    request.user.id = parseInt(payload.sub);

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
