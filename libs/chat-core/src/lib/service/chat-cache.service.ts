import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChatMessageDto, ChatRoomDto, ChatRoomUserDto, EnvironmentName } from '@eco-books/type-common';
import { RedisClient } from '../config/redis.client';
import { ConfigService } from '@nestjs/config';
import { ChatMessageDao, ChatRoomDao } from '../dao/chat-cache.dao';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { RedisCommandRawReply } from '@redis/client/dist/lib/commands';




@Injectable()
export class ChatCacheService extends RedisClient implements OnModuleInit {
  private readonly CHAT_ROOM_PREFIX: string = 'chat_room:';
  private readonly CHAT_ROOM_USER_PREFIX: string = 'chat_room_user:';
  private readonly CHAT_MESSAGE_PREFIX: string = 'chat_latest_message:';
  private readonly CHAT_RANK_PREFIX: string = 'chat_message_rank:';
  private readonly CHAT_ROOM_MESSAGE_COUNT_PREFIX: string =
    'chat_room_message_count:';
  private readonly CHAT_ROOM_MESSAGE_ID_PREFIX: string =
    'chat_room_message_id:';
  private readonly CHAT_UNSAVED_MESSAGE_PREFIX: string =
    'chat_unsaved_message:';

  constructor(private configService: ConfigService) {
    super();
    let url = this.configService.get<string>('redis-url');
    if (!url) {
      if (this.configService.get<string>('APP_ENV') === EnvironmentName.PROD) {
        throw new Error();
      }
      url = `redis://localhost:6379/${this.db}`;
    }
    this.url = url;
  }

  async onModuleInit() {
    await this.setRedisClient();
  }

  async saveChatRoom(chatRoomDao: ChatRoomDao) {
    await this.setData(
      this.CHAT_ROOM_PREFIX + chatRoomDao.id,
      chatRoomDao,
      60 * 60 * 3
    );
  }

  async findAllChatRoomByIdIn(ids: number[]) {
    const keys = ids.map((id) => this.CHAT_ROOM_PREFIX + id);
    return await this.mGetData<ChatRoomDao>(keys);
  }


  async findChatRoomById(id: number): Promise<ChatRoomDto> {
    const chatRoomDao = await this.getData<ChatRoomDao>(
      this.CHAT_ROOM_PREFIX + id
    );
    if (!chatRoomDao) {
      throw new RuntimeException(`not exists chatRoom id: ${id}`);
    }

    const chatRoomUsers = await this.mGetData<ChatRoomUserDto>(
      chatRoomDao.chatRoomUserIds.map(
        (value) => this.CHAT_ROOM_USER_PREFIX + value
      )
    );

    if (!chatRoomUsers) {
      throw new RuntimeException(`not exists chatRoomUsers chatRoomId: ${id}`);
    }

    return {
      id: chatRoomDao.id,
      updatedAt: chatRoomDao.updatedAt,
      userBookId: chatRoomDao.userBookId,
      createdAt: chatRoomDao.createdAt,
      chatRoomUsers: chatRoomUsers,
    };
  }

  // 채팅방 유저 추가
  // async saveChatRoomUser(chatRoomUserDto: ChatRoomUserDto, chatRoomDto: ChatRoomDto) {
  //   chatRoomDto.chatRoomUserIds.push(chatRoomUserDto.id);
  //   this.setData<ChatRoomDto>(this.CHAT_ROOM_PREFIX + chatRoomDto.id, chatRoomDto, 60 * 60 * 3);
  //   await this.setData(
  //     `${this.CHAT_ROOM_USER_PREFIX + chatRoomUserDto.userId}:${chatRoomUserDto.chatRoomId}`,
  //     chatRoomUserDto, 60 * 60 * 3);
  // }

  async updateCursorChatMessage(
    userId: number,
    chatRoomId: number,
    chatMessage: ChatMessageDto,
    chatRoomUser: ChatRoomUserDto
  ) {
    chatRoomUser.chatMessage = chatMessage;
    this.setData<ChatRoomUserDto>(
      `${this.CHAT_ROOM_USER_PREFIX + userId}:${chatRoomId}`,
      chatRoomUser,
      60 * 60 * 3
    );
  }

  async findAllChatRoomUserIdIn(ids: number[]) {
    const keys = ids.map((id) => this.CHAT_ROOM_USER_PREFIX + id);
    return await this.mGetData<ChatRoomUserDto>(keys);
  }

  async findChatRoomUsersThenRoomMap(
    ids: number[]
  ): Promise<Map<number, ChatRoomUserDto[]>> {
    const chatRoomUsers = await this.findAllChatRoomUserIdIn(ids);
    const map = new Map<number, ChatRoomUserDto[]>();
    if (!chatRoomUsers) {
      this.logger.warn('not find chatRoomUser from room');
      return map;
    }

    chatRoomUsers.forEach((value) => {
      const list = map.get(value.chatRoomId);
      if (!list) {
        map.set(value.chatRoomId, [value]);
        return;
      }
      list.push(value);
    });
    return map;
  }

  async findFirstChatRoomUserById(chatRoomUserId: number) {
    return await this.getData<ChatRoomUserDto>(
      this.CHAT_ROOM_USER_PREFIX + chatRoomUserId
    );
  }

  async saveChatMessage(chatMessageDto: ChatMessageDao) {
    this.setData<ChatMessageDao>(
      this.CHAT_MESSAGE_PREFIX + chatMessageDto.id,
      chatMessageDto
    );
    this.setData<string>(
      this.CHAT_UNSAVED_MESSAGE_PREFIX + chatMessageDto.id,
      'false'
    );
    this.zAdd<number>(
      this.CHAT_ROOM_MESSAGE_ID_PREFIX + chatMessageDto.chatRoomId,
      chatMessageDto.id,
      chatMessageDto.id
    );
  }

  async findAllRankedChatById(userId: number, offset: number, count: number) {
    const res = await this.pageZRangeWithScores<number>(
      this.CHAT_RANK_PREFIX + userId,
      offset,
      count
    );
    return this.mGetData<ChatMessageDto>(
      res.map((value) => this.CHAT_MESSAGE_PREFIX + value.score)
    );
  }

  async findAllChatCountByChatRoomIdIn(chatRoomIds: number[]) {
    await this.mGetData(
      chatRoomIds.map((value) => this.CHAT_ROOM_MESSAGE_COUNT_PREFIX + value)
    );
  }

  async getMessageIdAndSaveMessage(chatMessageDto: ChatMessageDto) {
    await this.getRedisClient()
      .multi()
      .incr(this.CHAT_ROOM_MESSAGE_COUNT_PREFIX + chatMessageDto.chatRoomId) // auto increase
      .get(this.CHAT_ROOM_MESSAGE_COUNT_PREFIX + chatMessageDto.chatRoomId)
      .exec()
      .then((result: RedisCommandRawReply[]) => {
        chatMessageDto.id = parseInt(result[0] as string);
        this.saveChatMessage(chatMessageDto);
        this.getRedisClient()
          .multi()
          .zRem(
            this.CHAT_RANK_PREFIX + chatMessageDto.userId,
            chatMessageDto.chatRoomId.toString()
          )
          .zAdd(this.CHAT_RANK_PREFIX + chatMessageDto.userId, {
            score: chatMessageDto.id,
            value: chatMessageDto.chatRoomId.toString(),
          })
          .exec();
        return result;
      });
  }

  async getChatMessages(chatId: number, chatRoomId: number, size: number) {
    const chatIds = await this.pageZRangeWithScores<number>(
      this.CHAT_ROOM_MESSAGE_ID_PREFIX + chatRoomId,
      chatId,
      size
    );
    return this.mGetData<ChatMessageDto>(
      chatIds.map((value) => this.CHAT_MESSAGE_PREFIX + value.score)
    );
  }
}
