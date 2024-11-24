import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ChatCursorCacheDao, ChatRoomDto, ChatRoomUserDto } from '@eco-books/type-common';
import { RedisClient } from '../config/redis.client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatCacheService extends RedisClient {

  private readonly CHAT_ROOM_PREFIX: string = 'chat_room:'
  private readonly CHAT_ROOM_USER_PREFIX: string = 'chat_room_user:'

  constructor(private configService: ConfigService) {
    super();
    this.setRedisClient(this.configService.get<string>('redis-url'));
  }

  async saveChatRoom(chatRoomDto :ChatRoomDto) {
    await this.setData(this.CHAT_ROOM_PREFIX + chatRoomDto.id, chatRoomDto, 60 * 60 * 3);
  }

  async findAllChatRoomByIdIn(ids: number[]) {
    const keys = ids.map(id => this.CHAT_ROOM_PREFIX + id);
    return await this.getArrayData<ChatRoomDto>(keys);
  }

  async saveChatRoomUser(chatRoomUserDto: ChatRoomUserDto) {
    await this.setData(this.CHAT_ROOM_USER_PREFIX + chatRoomUserDto.id, chatRoomUserDto, 60 * 60 * 3);
  }

  async findAllChatRoomUserIdIn(ids: number[]) {
    const keys = ids.map(id => this.CHAT_ROOM_USER_PREFIX + id);
    return await this.getArrayData<ChatRoomUserDto>(keys);
  }
}
