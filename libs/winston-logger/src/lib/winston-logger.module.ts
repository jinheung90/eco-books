import { Module } from '@nestjs/common';
import { WsLoggerInterceptor } from './filter/ws-logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: WsLoggerInterceptor,
  }],
  exports: [],
})
export class WinstonLoggerModule {}
