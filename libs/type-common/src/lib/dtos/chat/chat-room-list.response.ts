import { ChatMessageType } from '../../enums/chat/chat-message.type';
import { ChatMessageDto, ChatRoomUserDto } from './chat-room.dto';
import { RuntimeException } from '@nestjs/core/errors/exceptions';


export interface ChatRoomListResponse {
  chatPreviewList: Array<ChatPreviewDto>
}

export class ChatPreviewDto {
  chatRoomId: number;
  userBookId: number;
  unreadChatCount: number;
  latestChatMessageType: ChatMessageType;
  latestChatMessage: string;
  latestChatCreatedAt: Date;
  chatRoomUsers: Array<ChatRoomUserDto>;

  constructor() {
    this.chatRoomId = 0;
    this.chatRoomUsers = [];
    this.unreadChatCount = 0;
    this.latestChatMessage = "";
    this.userBookId = 0;
    this.latestChatMessageType = ChatMessageType.text;
    this.latestChatCreatedAt = new Date();
  }

  public static to(chatMessageDto: ChatMessageDto, chatRoomUserDtos: ChatRoomUserDto[], userId: number, chatCount: number) {
    const dto = new ChatPreviewDto();
    dto.chatRoomId = chatMessageDto.chatRoomId;
    dto.latestChatCreatedAt = chatMessageDto.createdAt;
    dto.latestChatMessage = chatMessageDto.message;
    dto.latestChatMessageType = chatMessageDto.chatMessageType;
    dto.chatRoomUsers = chatRoomUserDtos;

    let me;
    for (const user of chatRoomUserDtos) {
      if(user.userId === userId) {
        me = user;
        break;
      }
    }

    if(!me) {
      throw new RuntimeException('error');
    }

    dto.unreadChatCount = chatCount - me.chatMessage.id;
    return dto;
  }
}


