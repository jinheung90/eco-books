import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AwsParameterStoreProvider } from '@eco-books/aws-parameter-store';
import { ChatCoreModule} from '@eco-books/chat-core';
import { AuthCoreModule } from '@eco-books/auth-core';
import { ChatController } from './api/chat.controller';
import { ChatWsGateway } from './ws/chat-ws.gateway';
import { ExternalClientsModule } from '@eco-books/external-clients';
import { HealthCheckCoreModule } from '@eco-books/health-check-core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.chat-ws',
      load: [AwsParameterStoreProvider],
    }),
    ChatCoreModule,
    AuthCoreModule,
    ExternalClientsModule,
    HealthCheckCoreModule
  ],
  controllers: [ChatController],
  providers: [ChatWsGateway],
  exports: [],
})
export class AppModule {}
