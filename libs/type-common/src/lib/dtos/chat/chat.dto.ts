import { ChatMessageType } from '../../enums/chat/chat-message.type';

export interface ChatDto {
  message: string,
  chatMessageType: ChatMessageType,
  clientId: string,
  sendUserId: number,
  chatRoomUserId: number,
  chatRoomId: number
}
