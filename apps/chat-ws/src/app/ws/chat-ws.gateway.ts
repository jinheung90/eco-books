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
  ChatIncomeDto, ChatMessageDto, ChatRoomDto,
  JwtPayload
} from '@eco-books/type-common';
import { randomUUID } from 'node:crypto';

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


    const chatMessageDto: ChatMessageDto = {
      id: randomUUID().toString(),
      userId: dto.sendUserId,
      chatRoomId: dto.chatRoomId,
      chatMessageType: dto.chatMessageType,
      createdAt: new Date(),
      saved: false
    }



    this.sendMessageToAudience(dto);
   }

  @SubscribeMessage('/income-list')
  async incomeChatList(
    @MessageBody() dto: ChatIncomeDto,
    @ConnectedSocket() client: Socket & { user: JwtPayload }
  ) {
    let chatRoomDto: ChatRoomDto;
    // 채팅방 목록에서 접근하는 경우
    chatRoomDto = await this.chatCacheService.findChatRoomById(dto.chatRoomId);
    // 캐싱되지 않은 채팅방
    if(!chatRoomDto) {
      chatRoomDto = await this.chatService.getChatRoomElseThrow(
        dto.chatRoomId
      );
      this.chatCacheService.saveChatRoom(chatRoomDto);
    }

    client.join(this.ROOM_ID_PREFIX + chatRoomDto.id);
    return chatRoomDto;
  }

  @SubscribeMessage('/income-book-detail')
  async incomeBookDetail(
    @MessageBody() dto: ChatIncomeDto,
    @ConnectedSocket() client: Socket & { user: JwtPayload }
  ) {
    const chatRoomDto = await this.chatService.saveChatRoomElseThrow(client.user.id, dto.userBookId, dto.sellerId);
    this.chatCacheService.saveChatRoom(chatRoomDto);
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
