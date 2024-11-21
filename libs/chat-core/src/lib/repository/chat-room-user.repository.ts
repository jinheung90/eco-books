import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoomUser } from '../entity/chat-room-user';

@Injectable()
export class ChatRoomUserRepository extends Repository<ChatRoomUser>{
  async findFirstByUserBookIdAndBuyerIdAndActiveIsTrue(buyerId: number, userBookId: number) {
    return this.createQueryBuilder('cru')
      .innerJoin('chatRoomUser.chatRoom', 'cr')
      .where('cr.user_book_id = :userBookId', {userBookId})
      .andWhere('cru.user_id = :userId', {userId: buyerId})
      .andWhere('cr.activity is true')
      .getOne();
  }

}
