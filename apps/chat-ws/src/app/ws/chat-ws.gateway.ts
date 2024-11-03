import process from 'process';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtTokenService, JwtWsGuard } from '@eco-books/auth-core';
import {
  ChatCursorService,
  ChatHistoryService,
  ChatRoomService,
} from '@eco-books/chat-core';
import { BookServiceClients } from '@eco-books/external-clients';
import {
  ChatCursorDto,
  ChatDto,
  ChatIncomeDto,
  JwtPayload,
} from '@eco-books/type-common';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: [process.env['CLIENT_HOST'], 'http://localhost:3000'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
})
@UseGuards(JwtWsGuard)
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(ChatWsGateway.name);
  private readonly USER_CLIENTS_ROOM_ID_PREFIX = 'chat-user-id:';
  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly chatCursorService: ChatCursorService,
    private readonly chatHistoryService: ChatHistoryService,
    private readonly chatRoomService: ChatRoomService,
    private readonly bookServiceClients: BookServiceClients
  ) {}

  // 채팅 보내기
  @SubscribeMessage('/send')
  @UseGuards(JwtWsGuard)
  async sendChat(
    @MessageBody() dto: ChatDto,
    @ConnectedSocket() client: Socket & { user: JwtPayload }
  ) {
    dto.sendUserId = parseInt(client.user.sub);
    this.sendMessageToAudience(dto);
  }

  // 책 상세에서 채팅방 들어가기
  @SubscribeMessage('/income-book-detail')
  async incomeBookDetail(
    @MessageBody() data: ChatIncomeDto,
    @ConnectedSocket() client: Socket & { user: JwtPayload }
  ) {}

  // 채팅 리스트에서 채팅방 들어가기
  @SubscribeMessage('/income-chat-list')
  async incomeChatList(
    @MessageBody() data: ChatIncomeDto,
    @ConnectedSocket() client: Socket & { user: JwtPayload }
  ) {}

  // 커서 업데이트
  @SubscribeMessage('/update-cursor')
  async updateCursor(
    @MessageBody() data: ChatCursorDto,
    @ConnectedSocket() client: Socket & { user: JwtPayload }
  ) {
    this.updateCursorWithAnotherClients(parseInt(client.user.sub), data);
  }

  handleConnection(client: any, ...args: any[]): any {
    const token = client?.handshake?.headers?.authorization;
    this.tokenService.decodeAccessToken(token);
  }

  handleDisconnect(client: any): any {}

  private sendMessageToAudience(chatDto: ChatDto) {
    this.server.to(chatDto.roomId).emit('/chat/receive', chatDto);
  }

  private updateCursorWithAnotherClients(
    userId: number,
    cursorDto: ChatCursorDto
  ) {
    this.server
      .to(this.USER_CLIENTS_ROOM_ID_PREFIX + userId)
      .emit('/chat/update-cursor', cursorDto);
  }
}
