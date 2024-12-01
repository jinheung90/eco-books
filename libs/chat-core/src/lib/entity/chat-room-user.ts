import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { ChatRoom } from './chat-room';
import { ChatMessage } from './chat-message';
import { ChatRoomUserDto } from '@eco-books/type-common';

@Entity()
export class ChatRoomUser {

  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  isHost: boolean;
  @Column()
  activity: boolean;
  @OneToOne(() => ChatMessage)
  @JoinColumn({name: 'cursor_chat_message_id'})
  chatMessage: ChatMessage;
  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.chatRoomUsers)
  chatRoom: ChatRoom;
  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  static toEntity(userId: number, isHost: boolean, chatRoom: ChatRoom): ChatRoomUser {
    const entity = new ChatRoomUser();
    entity.chatRoom = chatRoom;
    entity.userId = userId;
    entity.isHost = isHost;
    return entity;
  }

  static toDto(chatRoomUser: ChatRoomUser) : ChatRoomUserDto {
    return {
      id: chatRoomUser.id,
      isHost: chatRoomUser.isHost,
      userId: chatRoomUser.userId,
      chatRoomId: chatRoomUser.chatRoom.id,
      chatMessage: ChatMessage.toDto(chatRoomUser.chatMessage),
      createdAt: chatRoomUser.createdAt,
      updatedAt: chatRoomUser.updatedAt,
      activity: chatRoomUser.activity
    }
  }
}
