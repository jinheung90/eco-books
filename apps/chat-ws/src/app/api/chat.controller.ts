import { Controller, Delete, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtApiGuard, JwtTokenService } from '@eco-books/auth-core';
import {
  Authorities,
  ChatRoomListResponse, JwtPayload,
  Roles
} from '@eco-books/type-common';
import { ChatCacheService, ChatService } from '@eco-books/chat-core';
import { BookServiceClients } from '@eco-books/external-clients';

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
    // 마지막 채팅을 가져온다 // 정렬해서 가져온다
    // 채팅 방 유저 목록을 가져온다
    // 채팅 방 목록을 가져온다
    // 채팅 유저 목록에서 마지막으로 읽은 채팅 아이디를 가져와서 안읽은 채팅 개수를 구한다

    return {
      chatPreviewList: [

      ],
    };
  }

  @Get('list')
  @Roles(Authorities.USER)
  getPageChats(
    @Req() request: Request & { user: JwtPayload },
    @Query('chatId') chatId: string,
    @Query('size') size: number
  ) {

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
