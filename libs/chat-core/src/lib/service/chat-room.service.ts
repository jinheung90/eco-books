import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from '../repository/chat-room.repository';

@Injectable()
export class ChatRoomService {
  constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

  async findByUserIdAndUserBookId(userId: number[], userBookId: number) {
    return this.chatRoomRepository.findByUserIdAndUserBookId(userId, userBookId);
  }
}
