import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoomUser } from '../entity/chat-room-user';
import { ChatPreviewDto, ChatRoomListResponse, PageResult } from '@eco-books/type-common';
import { plainToInstance } from 'class-transformer';
import { ChatMessage } from '../entity/chat-message';

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


  async findAllUserIdAndIsHostAndActivityIsTrueOrderByChatMessageCreatedAtDesc(userId: number, isHost: boolean, page: number, size: number): Promise<Array<ChatPreviewDto>> {
    const result = await this.createQueryBuilder('cr')
      .select([
        'cr.id', 'chatRoomId',
        'cr.user_book_id', 'userBookId',
      ]).addSelect((subQuery) => subQuery
          .select('COUNT(cmi.id)', 'count')
          .from('ChatMessage', 'cmi')
          .where('cru.chatMessage.id > cmi.id')
        , 'unreadChatCount')
      .addSelect([
        'cml.messageType', 'latestChatMessageType',
        'cml.context', 'latestChatMessage',
        'cml.created_at', 'latestChatCreatedAt',
      ]).innerJoin(
        query => query
          .select()
          .from('ChatMessage', 'cml')
          .where('cml.chat_room_id = cr.id')
          .orderBy('cml.id', 'DESC')
          .limit(1),
        'cml.chat_room_id = cr.id'
      )
      .innerJoin('chatRoom.chatRoomUser', 'cru')
      .where('cru.user_id = :userId', {userId})
      .andWhere('cru.activity is true')
      .andWhere('cru.is_host = :isHost', {isHost})
      .offset(page * size)
      .limit(size).getMany();
    return plainToInstance(ChatPreviewDto, result);
  }
}
