
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoom } from '../entity/chat-room';


@Injectable()
export class ChatRoomRepository extends Repository<ChatRoom> {



  // 제공자 유저 검색
  // async findAllByUserIdAndIsHost(userId: number, isHost: boolean, page: number, size: number) {
  //   return this.createQueryBuilder()
  //     .select([
  //       'chatRoom.id', 'id',
  //       'chatRoom.chatRoomUser', 'chatRoomUsers',
  //       'chatRoom.chatRoomUser.chatMessage',])
  //     .addSelect((subQuery) => {
  //       return subQuery.select(ChatMessage.name)
  //         .where('chatRoom.chatRoomUser.chatMessage.id > chatMessage.id')
  //         .andWhere('chatMessage.userId = :userId', {userId: userId})
  //         .andWhere('chat')
  //         .getCount()
  //     }, 'unreadMessageCount')
  //     .addSelect((subQuery) => {
  //       return
  //     })
  //     .andWhere("chatRoom.chatRoomUser.userId = :userId", { userId: userId })
  //     .andWhere("chatRoom.chatRoomUser.isHost = :isHost", { isHost: isHost })
  //     .orderBy()
  //     .limit(size)
  //     .offset(page * size);
  //
  // }
}
