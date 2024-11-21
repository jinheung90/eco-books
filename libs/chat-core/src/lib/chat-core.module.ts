import { Module } from '@nestjs/common';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { CacheModule } from '@nestjs/cache-manager';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RedisClientOptions } from 'redis';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { redisStore } from 'cache-manager-redis-yet';
import { ChatService } from './service/chat.service';
import { ConfigService } from '@nestjs/config';
import { chatDbProvider } from './config/chat-db.provider';
import { ChatCacheService } from './service/chat-cache.service';
// import { ChatRoomRepository } from './repository/chat-room.repository';
// import { ChatMessageRepository } from './repository/chat-message.repository';
//

@Module({
  imports: [CacheModule.registerAsync<RedisClientOptions>({
    isGlobal: false,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      store: await redisStore({
        socket: {
          port: configService.get<number>('redis-port') || 6379,
          host: configService.get<string>('redis-host'),
        },
      }),
    }),
  }),],
  providers: [... chatDbProvider,
    // ChatRoomRepository, ChatMessageRepository
  ],
  exports: [ChatService, ChatCacheService],
})
export class ChatCoreModule {}
