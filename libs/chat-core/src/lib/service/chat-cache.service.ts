import { Injectable } from '@nestjs/common';
import { ChatMessageDto, ChatRoomDto, ChatRoomUserDto } from '@eco-books/type-common';
import { RedisClient } from '../config/redis.client';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class ChatCacheService extends RedisClient {

  private readonly CHAT_ROOM_PREFIX: string = 'chat_room:'
  private readonly CHAT_ROOM_USER_PREFIX: string = 'chat_room_user:'
  private readonly CHAT_MESSAGE_PREFIX: string = 'chat_latest_message:'
  private readonly CHAT_RANK_PREFIX: string = 'chat_message_rank:'
  constructor(private configService: ConfigService) {
    super();
    this.setRedisClient(this.configService.get<string>('redis-url'), 0);
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
  // 채팅방 유저 추가
  // async saveChatRoomUser(chatRoomUserDto: ChatRoomUserDto, chatRoomDto: ChatRoomDto) {
  //   chatRoomDto.chatRoomUserIds.push(chatRoomUserDto.id);
  //   this.setData<ChatRoomDto>(this.CHAT_ROOM_PREFIX + chatRoomDto.id, chatRoomDto, 60 * 60 * 3);
  //   await this.setData(
  //     `${this.CHAT_ROOM_USER_PREFIX + chatRoomUserDto.userId}:${chatRoomUserDto.chatRoomId}`,
  //     chatRoomUserDto, 60 * 60 * 3);
  // }

  async updateCursorChatMessage(userId: number, chatRoomId: number, chatMessage: ChatMessageDto, chatRoomUser: ChatRoomUserDto) {
    chatRoomUser.chatMessage = chatMessage;
    this.setData<ChatRoomUserDto>(
      `${this.CHAT_ROOM_USER_PREFIX + userId}:${chatRoomId}`,
      chatRoomUser,
      60 * 60 * 3
    )
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

  async saveChatMessage(chatMessageDto: ChatMessageDto) {
    return await this.setData<ChatMessageDto>(this.CHAT_MESSAGE_PREFIX + chatMessageDto.id, chatMessageDto, null);
  }


  async findAllRankedChatById(userId: number, page: number, size: number) {
    return this.getRedisClient().zRangeByScore(
      this.CHAT_RANK_PREFIX + userId,
      page * size,
      size
    )
  }

}
