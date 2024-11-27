import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ChatCursorCacheDao, ChatMessageDto, ChatRoomDto, ChatRoomUserDto } from '@eco-books/type-common';
import { RedisClient } from '../config/redis.client';
import { ConfigService } from '@nestjs/config';
import { ChatMessage } from '../entity/chat-message';

@Injectable()
export class ChatCacheService extends RedisClient {

  private readonly CHAT_ROOM_PREFIX: string = 'chat_room:'
  private readonly CHAT_ROOM_USER_PREFIX: string = 'chat_room_user:'
  private readonly CHAT_LATEST_MESSAGE_PREFIX: string = 'chat_latest_message:'
  private readonly CHAT_RANK_PREFIX: string = 'chat_message_rank:'
  constructor(private configService: ConfigService) {
    super();
    this.setRedisClient(this.configService.get<string>('redis-url'));
  }

  async saveChatRoom(chatRoomDto :ChatRoomDto) {
    await this.setData(this.CHAT_ROOM_PREFIX + chatRoomDto.id, chatRoomDto, 60 * 60 * 3);
  }

  async findAllChatRoomByIdIn(ids: number[]) {
    const keys = ids.map(id => this.CHAT_ROOM_PREFIX + id);
    return await this.mgetData<ChatRoomDto>(keys);
  }

  async findChatRoomById(id: number) {
    return await this.getData<ChatRoomDto>(this.CHAT_ROOM_PREFIX + id);
  }

  // key:userId:chatRoomUserId
  async saveChatRoomUser(chatRoomUserDto: ChatRoomUserDto) {
    await this.setData(
      `${this.CHAT_ROOM_USER_PREFIX + chatRoomUserDto.userId}:${chatRoomUserDto.id}`,
      chatRoomUserDto, 60 * 60 * 3);
  }

  async findAllChatRoomUserIdIn(ids: number[]) {
    const keys = ids.map(id => this.CHAT_ROOM_USER_PREFIX + id);
    return await this.mgetData<ChatRoomUserDto>(keys);
  }

  async findFirstChatRoomUserById(chatRoomUserId: number) {
    return await this.getData<ChatRoomUserDto>(
      this.CHAT_ROOM_USER_PREFIX + chatRoomUserId
    );
  }

  async saveLatestChatMessage(chatMessageDto: ChatMessageDto) {
    const messageRedisKey= this.CHAT_LATEST_MESSAGE_PREFIX + chatMessageDto.id;
    this.zadd<string>(this.CHAT_RANK_PREFIX + chatMessageDto.userId, -chatMessageDto.id, messageRedisKey);
    this.setData<ChatMessageDto>(messageRedisKey, chatMessageDto, 60 * 60 * 3);
  }

  async findLatestChatMessage(chatRoomId: number) {
    return await this.getData<ChatMessageDto>(
      this.CHAT_LATEST_MESSAGE_PREFIX + chatRoomId
    );
  }

  async findAllLatestChatMessage(ids: number[]) {
    const keys = ids.map(id => this.CHAT_LATEST_MESSAGE_PREFIX + id);
    return await this.mgetData<ChatRoomUserDto>(keys);
  }

  async saveRankedChatMessageId(userId: number, chatRoomId: number) {
    await
  }

}
