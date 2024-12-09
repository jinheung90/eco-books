import { ChatMessageType, ChatRoomDto } from '@eco-books/type-common';
import { ChatRoom } from '../entity/chat-room';


export class ChatRoomDao {
  id: number;
  userBookId: number;
  chatRoomUserIds: number[];
  createdAt: Date;
  updatedAt: Date;

  constructor(id: number, userBookId: number, chatRoomUserIds: number[], createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.userBookId = userBookId;
    this.chatRoomUserIds = chatRoomUserIds;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static fromEntity(chatRoom: ChatRoom): ChatRoomDao {
    return new ChatRoomDao(
      chatRoom.id,
      chatRoom.userBookId,
      chatRoom.chatRoomUsers.map(value => value.userId),
      chatRoom.createdAt,
      chatRoom.updatedAt
    );
  }

  public static fromDto(chatRoom: ChatRoomDto): ChatRoomDao {
    return new ChatRoomDao(
      chatRoom.id,
      chatRoom.userBookId,
      chatRoom.chatRoomUsers.map(value => value.userId),
      chatRoom.createdAt,
      chatRoom.updatedAt
    );
  }
}

export interface ChatRoomUserDao {
  id: number;
  userId: number;
  chatRoomId: number;
  isHost: boolean;
  activity: boolean;
  chatMessage: ChatMessageDao
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessageDao {
  id: number;
  userId: number;
  chatRoomId: number;
  chatMessageType: ChatMessageType;
  message: string;
  createdAt: Date;
}
