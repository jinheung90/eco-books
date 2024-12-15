import { ChatMessageType } from '../../enums/chat/chat-message.type';


export interface ChatRoomDto {
  id: number,
  userBookId: number,
  chatRoomUsers: Array<ChatRoomUserDto>,
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
  id: number;
  sendClientId: string;
  sendUserId: number;
  chatRoomId: number;
  chatMessageType: ChatMessageType;
  message: string;
  createdAt: Date;
}
