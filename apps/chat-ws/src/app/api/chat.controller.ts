import { Controller, Delete, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtApiGuard, JwtTokenService } from '@eco-books/auth-core';
import {
  Authorities, ChatPreviewDto, ChatRoomDto,
  ChatRoomListResponse, ChatRoomUserDto, JwtPayload,
  Roles
} from '@eco-books/type-common';
import { ChatCacheService, ChatRoomUser, ChatService } from '@eco-books/chat-core';
import { BookServiceClients } from '@eco-books/external-clients';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

@Controller('chat')
@UseGuards(JwtApiGuard)
export class ChatController {
  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly chatService: ChatService,
    private readonly bookServiceClients: BookServiceClients,
    private readonly chatCacheService: ChatCacheService
  ) {}

  @Get('room/list')
  @Roles(Authorities.USER)
  async getChatRoomList(
    @Req() request: Request & { user: JwtPayload },
    @Query('page') page: number,
    @Query('size') size: number
  ): Promise<ChatRoomListResponse> {
    const chatMessages = await this.chatCacheService.findAllRankedChatById(request.user.id, page, size);
    const chatRoomIds = chatMessages.map(v => v.chatRoomId);
    const chatRooms = await this.chatCacheService.findAllChatRoomByIdIn(chatRoomIds);
    const chatRoomUserIds = [];
    chatRooms.forEach(value => chatRoomUserIds.push(value.chatRoomUserIds));
    const chatRoomUserMap = await this.chatCacheService.findChatRoomUsersThenRoomMap(chatRoomUserIds);
    const chatCounts = await this.chatCacheService.findAllChatCountByChatRoomIdIn(chatRoomIds);
    return {
      chatPreviewList: chatMessages.map((value, index) => {
        return ChatPreviewDto.to(value, chatRoomUserMap.get(value.chatRoomId), request.user.id, chatCounts[index]);
      })
    };
  }

  @Get('list')
  @Roles(Authorities.USER)
  getPageChats(
    @Req() request: Request & { user: JwtPayload },
    @Param("id") id: number,
    @Query('chatId') chatId: number,
    @Query('size') size: number
  ) {
    return this.chatCacheService.getChatMessages(chatId, id, size);
  }

  @Delete('room/out')
  @Roles(Authorities.USER)
  leaveChatRoom(
    @Param('id') chatRoomId: number
  ) {
    return {

    }
  }
}
