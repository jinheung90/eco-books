
import { Injectable } from '@nestjs/common';
import { ChatMessage } from '../entity/chat-message';
import { Repository } from 'typeorm';


@Injectable()
export class ChatMessageRepository extends Repository<ChatMessage> {

  async findFirstByChatRoomIdOrderByIdDesc(chatRoomId: number) {
    return await this.createQueryBuilder('cm').select()
      .where('cm.chat_room_id = :chatRoomId', {chatRoomId})
      .orderBy('cm.id', 'DESC')
      .getOne();
  }
}
