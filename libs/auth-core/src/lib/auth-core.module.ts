import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtWsGuard } from './guard/jwt-ws.guard';
import { JwtTokenService } from './jwt/jwt-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('jwt.secret'),
        verifyOptions: { algorithms: ['HS256'] },
      }),
    }),
  ],
  controllers: [],
  providers: [JwtTokenService, JwtWsGuard],
  exports: [JwtTokenService, JwtWsGuard],
})
export class AuthCoreModule {}
