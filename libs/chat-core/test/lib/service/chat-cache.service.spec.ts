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
import { ChatRoomDao } from '../../../src/lib/dao/chat-cache.dao';



describe('ChatCacheService', () => {
  let chatCacheService: ChatCacheService;
  const testChatRooms = new Array<ChatRoomDao>;
  const createChatRooms = () => {
    const init = new ChatRoomDao(
      0,
      1,
      [1, 2],
      new Date(),
      new Date(),
    );
    for (let i = 0; i < 10; i++) {
      init.id++;
      init.userBookId++;
      testChatRooms.push(init);
    }
  }

  beforeEach(async () => {
    console.log('a');
    const moduleRef = await Test.createTestingModule({
      providers: [ChatCacheService, {
        provide: ConfigService,
        useValue: {
          get: jest.fn((key: string) => {
            if(key === 'redis-url') {
              return 'redis://localhost:6379';
            } else if (key === 'APP_ENV') {
              return EnvironmentName.LOCAL;
            } else {
              return null;
            }
          })
        }
      }],
    }).compile();
    chatCacheService = moduleRef.get(ChatCacheService);
    createChatRooms();
  });

  afterEach(async () => {

  })

  it('save chat room', async () => {
    console.log('b');
    testChatRooms.forEach(
      value => chatCacheService.saveChatRoom(value)
    )
    const result = await chatCacheService.findAllChatRoomByIdIn(testChatRooms.map(value => value.id));
    expect(result.length).toBe(10);
  })

});
