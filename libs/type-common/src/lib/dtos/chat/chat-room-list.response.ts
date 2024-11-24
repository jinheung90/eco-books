import { ChatMessageType } from '../../enums/chat/chat-message.type';
import { ChatRoomUserDto } from './chat-room.dto';


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
  userIds: Array<ChatRoomUserDto>;

  constructor() {
    this.chatRoomId = 0;
    this.userIds = [];
    this.unreadChatCount = 0;
    this.latestChatMessage = "";
    this.userBookId = 0;
    this.latestChatMessageType = ChatMessageType.text;
    this.latestChatCreatedAt = new Date();
  }
}


