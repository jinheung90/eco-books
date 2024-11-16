import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@eco-books/type-common';


@Injectable()
export class JwtTokenService {
  private logger = new Logger(JwtTokenService.name);

  constructor(private readonly jwtService: JwtService) {}

  decodeAccessToken(resolvedToken: string): JwtPayload {
    return this.jwtService.decode<JwtPayload>(resolvedToken);
  }

  checkExpired(exp: number) {
    return exp <= (new Date().getTime() / 1000);
  }

}
