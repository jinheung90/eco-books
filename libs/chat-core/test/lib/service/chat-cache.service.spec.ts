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



describe('ChatCacheService', () => {
  let chatCacheService: ChatCacheService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ChatCacheService, {
        provide: ConfigService,
        useValue: {
          get: jest.fn((key: string) => {
            if(key === 'redis-url') {
              return 'redis://localhost:6379';
            } else if (key === 'APP_ENV') {
              return EnvironmentName.LOCAL;
            }
          })
        }
      }],
    }).compile();
    chatCacheService = moduleRef.get(ChatCacheService);
  });

  afterEach(async () => {
    chatCacheService.flushAll();
  })


});
