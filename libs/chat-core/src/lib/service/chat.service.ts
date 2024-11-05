import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from '../repository/chat-room.repository';
import { ChatMessage } from '../entity/chat-message';
import { ChatMessageRepository } from '../repository/chat-message.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly chatMessageRepository :ChatMessageRepository
  ) {


  }

}
