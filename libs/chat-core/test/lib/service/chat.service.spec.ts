import { ChatCacheService } from '../../../src/lib/service/chat-cache.service';
import { Test } from '@nestjs/testing';
import {
  ChatMessageDto,
  ChatMessageType,
  ChatRoomDto,
  ChatRoomUserDto,
  EnvironmentName,
  MathFunction
} from '@eco-books/type-common';
import { ChatRoomUser } from '../../../src/lib/entity/chat-room-user';
import { ConfigService } from '@nestjs/config';
import { ChatService } from '@eco-books/chat-core';
import { chatDbProvider } from '../../../src/lib/config/chat-db.provider';



describe('ChatCacheService', () => {
  let chatService: ChatService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [...chatDbProvider, ChatService, {
        provide: ConfigService,
        useValue: {
          get: jest.fn((key: string) => {
            switch (key) {
              case 'mysql-url': return 'jdbc:mysql://localhost:3306';
              case 'mysql-name:': return 'root';
              case 'mysql-password': return '1234';
              case 'mysql-db': return 'eco_books_chat_test';
              case 'APP_ENV': return EnvironmentName.LOCAL;
              default: return null;
            }
          })
        }
      }],
    }).compile();
    chatService = moduleRef.get(ChatService);
  });

});
