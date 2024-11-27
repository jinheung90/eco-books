import process from 'process';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { JwtTokenService, JwtWsGuard } from '@eco-books/auth-core';
import { ChatCacheService, ChatMessage, ChatRoomUser, ChatService, WsExceptionFilter } from '@eco-books/chat-core';
import { BookServiceClients } from '@eco-books/external-clients';
import {
  ChatCursorDto,
  ChatDto,
  ChatIncomeDto,
  JwtPayload,
} from '@eco-books/type-common';

@WebSocketGateway({
  namespace: 'ws/chat',
  cors: {
    origin: [process.env['CLIENT_HOST'], 'http://localhost:3000'],
    credentials: true,
    transports: ['websocket']
  },
})
@UseFilters(WsExceptionFilter)
// @UseGuards(JwtWsGuard)
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(ChatWsGateway.name);
  private readonly ROOM_ID_PREFIX = 'chat-user-id:';
  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly chatService: ChatService,
    private readonly chatCacheService: ChatCacheService,
    private readonly bookServiceClients: BookServiceClients
  ) {}

  // 채팅 보내기
  @SubscribeMessage('/send')
  @UseGuards(JwtWsGuard)
  async receiveChat(
    @MessageBody() dto: ChatDto,
    @ConnectedSocket() client: Socket & { user: JwtPayload }
  ) {
    dto.sendUserId = parseInt(client.user.sub);
    dto.clientId = client.id;
    const chatMessage = await this.chatService.insertChat(dto.sendUserId, dto.chatRoomId, dto.message, dto.chatMessageType);
    const chatRoomDto =  await this.chatCacheService.findChatRoomById(dto.chatRoomUserId);
    // this.chatCacheService.saveLatestChatMessage(ChatMessage.toDto(chatMessage), dto.sendUserId);
    this.sendMessageToAudience(dto);
   }

  @SubscribeMessage('/income')
  async incomeChatList(
    @MessageBody() data: ChatIncomeDto,
    @ConnectedSocket() client: Socket & { user: JwtPayload }
  ) {
    const chatRoomDto = await this.chatService.getChatRoomWhenIncome(
      data.chatRoomId,
      parseInt(client.user.sub),
      data.userBookId,
      data.sellerId
    )
    client.join(this.ROOM_ID_PREFIX + chatRoomDto.id);
    return chatRoomDto;
  }

  // 커서 업데이트
  // @SubscribeMessage('/update-cursor')
  // async updateCursor(
  //   @MessageBody() dto: ChatCursorDto,
  //   @ConnectedSocket() client: Socket & { user: JwtPayload }
  // ) {
  //
  //   this.updateCursorWithAnotherClients(parseInt(client.user.sub), dto);
  // }

  handleConnection(client: any, ...args: any[]): any {

  }

  handleDisconnect(client: any) {

  }

  private sendMessageToAudience(chatDto: ChatDto) {
    this.server.to(this.ROOM_ID_PREFIX + chatDto.chatRoomId).emit('/receive', chatDto);
  }

  private updateCursorWithAnotherClients(
    userId: number,
    cursorDto: ChatCursorDto
  ) {
    this.server
      .to(this.ROOM_ID_PREFIX + userId)
      .emit('/chat/update-cursor', cursorDto);
  }
}
