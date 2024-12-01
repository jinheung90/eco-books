import { Injectable } from '@nestjs/common';
import { ChatRoomRepository } from '../repository/chat-room.repository';

import { ChatMessageRepository } from '../repository/chat-message.repository';
import { ChatRoomUserRepository } from '../repository/chat-room-user.repository';
import { DataSource } from 'typeorm';
import { ChatRoom } from '../entity/chat-room';
import { ChatRoomUser } from '../entity/chat-room-user';
import { ChatMessageType } from '@eco-books/type-common';
import { ChatMessage } from '../entity/chat-message';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly chatMessageRepository :ChatMessageRepository,
    private readonly chatRoomUserRepository :ChatRoomUserRepository,
    private readonly dataSource: DataSource
  ) {}

  async getChatRoom(buyerId: number, userBookId: number) {
    return await this.chatRoomUserRepository.findFirstByUserBookIdAndBuyerIdAndActiveIsTrue(
      buyerId, userBookId
    );
  }

  async getChatRoomElseCreate(buyerId: number, userBookId: number, sellerId: number) {
    return this.dataSource.manager.transaction(async () => {
      const result = await this.getChatRoom(buyerId, userBookId);
      if(!result) {
        const chatRoom = await this.chatRoomRepository.save(new ChatRoom(userBookId));
        const entityArray = [
          ChatRoomUser.toEntity(buyerId, false, chatRoom), ChatRoomUser.toEntity(sellerId, true, chatRoom)
        ];
        const userList = await this.chatRoomUserRepository.save(entityArray);
        chatRoom.chatRoomUsers = userList;
        return chatRoom;
      }
      return result.chatRoom;
    })
  }
  async getChatRoomById(roomId: number) {
    return await this.chatRoomRepository.findOneBy({
      id: roomId
    });
  }

  async getChatRoomWhenIncome(chatRoomId: number, buyerId: number, userBookId: number, sellerId: number) {
    let chatRoom: ChatRoom;
    if(!chatRoomId) {
      chatRoom = await this.getChatRoomElseCreate(
        buyerId,
        userBookId,
        sellerId
      );
    } else {
      chatRoom = await this.getChatRoomById(chatRoomId);
      if(!chatRoom) throw new RuntimeException("error");
    }
    return ChatRoom.toDto(chatRoom);
  }

  async insertChat(userId: number, chatRoomId: number, message: string, chatMessageType: ChatMessageType) {
    const chatMessage = new ChatMessage();
    chatMessage.userId = userId;
    chatMessage.chatRoomId = chatRoomId;
    chatMessage.messageType = chatMessageType;
    chatMessage.context = message;
    return this.chatMessageRepository.save(chatMessage);
  }
  //
  // async pageChatRoomListByUserId(userId: number, isHost: boolean, page: number, size: number) {
  //   return this.dataSource.manager.transaction(async () => {
  //
  //     return result.chatRoom;
  //   })
  // }

  async findChatRoomUserById(chatRoomUserId: number) {
    return await this.chatRoomUserRepository.findFirstById(chatRoomUserId);
  }



}
