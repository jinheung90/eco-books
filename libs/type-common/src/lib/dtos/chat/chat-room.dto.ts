import { ChatMessageType } from '../../enums/chat/chat-message.type';
import { ChatMessage } from '@eco-books/chat-core';

export interface ChatRoomDto {
  id: number,
  userBookId: number,
  chatRoomUserIds: number[],
  createdAt: Date,
  updatedAt: Date,
}

export interface ChatRoomUserDto {
  id: number;
  userId: number;
  chatRoomId: number;
  isHost: boolean;
  activity: boolean;
  chatMessage: ChatMessageDto
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessageDto {
  id: number,
  userId: number,
  chatRoomId: number,
  chatMessageType: ChatMessageType,
  message: string,
  createdAt: Date,
}
