import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AwsParameterStoreProvider } from '@eco-books/aws-parameter-store';
import { ChatCoreModule } from '@eco-books/chat-core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.chat-ws',
      load: [AwsParameterStoreProvider],
    }),
    ChatCoreModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
