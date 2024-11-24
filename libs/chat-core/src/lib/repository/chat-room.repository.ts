
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoom } from '../entity/chat-room';

@Injectable()
export class ChatRoomRepository extends Repository<ChatRoom> {
  async findAllByUserIdAndIsHost(userId: number, isHost: boolean, page: number, size: number) {
    return await this.createQueryBuilder('cr')
      .innerJoin('chatRoom.chatRoomUser', 'cru')
      .where('cru.user_id = :userId', {userId})
      .andWhere('cru.activity is true')
      .andWhere('cru.is_host = :isHost', {isHost})
      .offset(page * size)
      .limit(size).getMany();
  }
}
