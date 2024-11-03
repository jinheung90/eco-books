import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistory, ChatHistorySchema } from './entity/chat-history';
import { ChatRoom, ChatRoomSchema } from './entity/chat-room';
import { ChatRoomService } from './service/chat-room.service';
import { ChatCursorService } from './service/chat-cursor.service';
import { ChatHistoryService } from './service/chat-history.service';
import { ChatHistoryRepository } from './repository/chat-history.repository';
import { ChatCursorRepository } from './repository/chat-cursor.repository';
import { ChatRoomRepository } from './repository/chat-room.repository';
import { ChatCursor, ChatCursorSchema } from './entity/chat-cursor';
import { ConfigService } from '@nestjs/config';


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
  }),
  MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return {
        uri: configService.get<string>('mongodb-full-url'),
        user: configService.get<string>('mongodb-name'),
        pass: configService.get<string>('mongodb-password'),

      }
    },
  }),
  MongooseModule.forFeature([
    {
      name: ChatHistory.name,
      schema: ChatHistorySchema,
    },
    {
      name: ChatCursor.name,
      schema: ChatCursorSchema
    },
    {
      name: ChatRoom.name,
      schema: ChatRoomSchema,
    }
  ]),
  ],
  providers: [ChatRoomService, ChatCursorService, ChatHistoryService, ChatHistoryRepository, ChatCursorRepository, ChatRoomRepository],
  exports: [ChatRoomService, ChatCursorService, ChatHistoryService],
})
export class ChatCoreModule {}
