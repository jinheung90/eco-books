/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import process from 'process';
import { ConfigService } from '@nestjs/config';
// import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

import { RedisIoAdapter } from '@eco-books/chat-core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const logger = new Logger('main');
  const port = parseInt(process.env.PORT) || 8081;
  const configService = app.get<ConfigService>(ConfigService);


  app.enableCors({
    credentials: true,
    allowedHeaders: ['*'],
    methods: ['*'],
    origin: [
      ...configService.get<string>('CLIENT_HOST').split(','),
      configService.get<string>('USER_SERVICE_APP'),
    ],
  });
  logger.log(configService.get('redis-url'));

  await app.listen(port);

  const redisAdapter = new RedisIoAdapter();
  await redisAdapter.connectToRedis(configService.get('redis-url'))
  app.useWebSocketAdapter(redisAdapter);

  //todo react 관련 문제 해결해야함
  // const asyncApi = new AsyncApiDocumentBuilder()
  //   .setTitle('채팅 서비스')
  //   .setDescription('채팅 서비스')
  //   .setVersion('1.0')
  //   .setDefaultContentType('application/json')
  //   // .addSecurity()// none
  //   .addServer('chatting-ws', {
  //     url: configService.get<string>('APP_SERVER_URL'),
  //     protocol: 'socket.io',
  //   })
  //   .build();
  // const asyncApiDocument = AsyncApiModule.createDocument(app, asyncApi);
  // await AsyncApiModule.setup('/async', app, asyncApiDocument);


  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
