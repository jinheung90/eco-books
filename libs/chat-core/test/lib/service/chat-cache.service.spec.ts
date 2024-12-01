import { ChatCacheService } from '../../../src/lib/service/chat-cache.service';
import { Test } from '@nestjs/testing';
import { ChatMessageDto, ChatMessageType, ChatRoomDto, ChatRoomUserDto, MathFunction } from '@eco-books/type-common';
import { ChatRoomUser } from '../../../src/lib/entity/chat-room-user';
import { ConfigService } from '@nestjs/config';



describe('ChatCacheService', () => {
  let chatCacheService: ChatCacheService;
  const chatRoomIds = 100;
  const userIds = 100;
  const chatSize = 20;
  const chatUserIdSize = 2;
  const testChatMessages: Map<number, Array<ChatMessageDto>> = new Map<number, Array<ChatMessageDto>>();
  const chatRoomUserIdMap: Map<number, Array<number>> = new Map<number, number[]>();
  const testChatRoomDtos: ChatRoomDto[] = [];
  const chatRoomUserMap: Map<number, ChatRoomUserDto> = new Map<number, ChatRoomUserDto>();
  const createChatRoomIds = () => { // 채팅 방 아이디, 유저 아이디 연결 저장
    for (let i = 0; i < chatRoomIds; i++) {
      const randUserIds = new Set<number>;
      for (let j = 0; j < chatUserIdSize; j++) {
        while (randUserIds.size < 2) {
          randUserIds.add(MathFunction.randomInteger(1, userIds));
        }
      }
      chatRoomUserIdMap.set(i + 1, Array.from(randUserIds));
    }
  }

  // 테스트 유저아이디 채팅 생성
  const createTestChatMessages = () => {
    let chatIdGen = 1;
    for (const [key, value] of chatRoomUserIdMap) {
      for (let i = 0; i < chatSize; i++) {
        const userId =  value[MathFunction.randomInteger(0, chatUserIdSize - 1)];
        const newChat = {
          id: chatIdGen,
          userId: userId,
          chatRoomId: key,
          chatMessageType: ChatMessageType.text,
          message: `id: ${chatIdGen}, chatRoomId: ${key}, userId: ${userId}`,
          createdAt: new Date()
        };
        const messageArray = testChatMessages.get(userId);
        if(messageArray) {
          messageArray.push(newChat);
        } else {
          testChatMessages.set(userId, [newChat]);
        }
        chatIdGen++;
      }
    }
  }

  // 전체 dto 생성
  const createTestChatData = () => {
    let userBookIdGen = 1;
    for (const [key, userIds] of chatRoomUserIdMap) {
      const chatRoom: ChatRoomDto = {
        id: key,
        chatRoomUserIds: userIds,
        userBookId: userBookIdGen,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      userBookIdGen++;
      userIds.forEach((value, index) => {
        const whileCount = 1;
        const messages = testChatMessages.get(value);
        let cursorMessage;
        while (whileCount < 100) {
          const message = messages[MathFunction.randomInteger(0, chatSize - 1)];
          if(message.chatRoomId === key) {
            cursorMessage = message;
            break;
          }
        }
        setChatRoomUser(value, index === 0, key, cursorMessage)
      })
      testChatRoomDtos.push(chatRoom);
    }
  }

  // 저장된 채팅 중 해당 유저아이디 채팅방아이디 통해 커서 채팅 구함
  const getChatMessageFromUserIdAndChatRoomId = (userId: number, chatRoomId: number) =>  {
    let cursorChat: ChatMessageDto;
    let whileCount = 1;
    const arrayMessages = testChatMessages.get(userId);
    while (whileCount < 100) {
      const tempMessage = arrayMessages[MathFunction.randomInteger(0, chatSize - 1)];
      whileCount++;
      if(tempMessage.chatRoomId === chatRoomId) {
        cursorChat = tempMessage;
        break;
      }
    }
    return cursorChat;
  }

  const setChatRoomUser = (userId: number, isHost: boolean, chatRoomId: number, chatMessage: ChatMessageDto) => {
    return chatRoomUserMap.set(userId, {
      id: 1,
      isHost: isHost,
      userId: userIds,
      chatRoomId: chatRoomId,
      chatMessage: chatMessage,
      createdAt: new Date(),
      activity: true,
      updatedAt: new Date()
    });
  }

  // 레디스에 전체 테스트 데어터 저장
  const saveTestData = (chatCacheService: ChatCacheService) => {
    for (const c of testChatRoomDtos) {
      chatCacheService.saveChatRoom(c);
    }

    for (const [key, value] of testChatMessages) {
      value.forEach(
        message =>
          chatCacheService.saveLatestChatMessage(message)
      );

    }
  }


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ChatCacheService, {
        provide: ConfigService,
        useValue: {
          get: jest.fn((key: string) => {
            if(key === 'redis-url') {
              return 'redis://localhost:6379';
            }
          })
        }
      }],
    }).compile();

    chatCacheService = moduleRef.get(ChatCacheService);
    createChatRoomIds();
    createTestChatMessages();
    createTestChatData();
    saveTestData(chatCacheService);
  });

  afterEach(async () => {
    chatCacheService.flushAll();
  })


});
