import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtApiGuard, JwtTokenService } from '@eco-books/auth-core';
import {
  Authorities,
  ChatRoomListResponse,
  Roles,
} from '@eco-books/type-common';
import { ChatService } from '@eco-books/chat-core';
import { BookServiceClients } from '@eco-books/external-clients';

@Controller('chat')
@UseGuards(JwtApiGuard)
export class ChatController {
  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly chatService: ChatService,
    private readonly bookServiceClients: BookServiceClients
  ) {}

  @Get('room/list')
  @Roles(Authorities.USER)
  getChatRoomList(@Req() request: Request): ChatRoomListResponse {
    return {
      chatPreviewList: [

      ],
    };
  }

  @Get('list')
  @Roles(Authorities.USER)
  getPageChats(
    @Req() request: Request,
    @Query('chatId') chatId: string,
    @Query('size') size: number
  ) {

  }
}
