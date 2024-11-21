import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ChatRoomUser } from './chat-room-user';
import { ChatRoomDto } from '@eco-books/type-common';

@Entity()
export class ChatRoom {

  constructor(userBookId: number) {
    this.userBookId = userBookId;
    this.activity = true;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userBookId: number;

  @OneToMany(() => ChatRoomUser, chatRoomUser => chatRoomUser.chatRoom)
  chatRoomUsers: ChatRoomUser[];

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @Column()
  activity: boolean;

  static toDto(chatRoom: ChatRoom): ChatRoomDto {
    return {
      id: chatRoom.id,
      userBookId: chatRoom.userBookId,
      chatRoomUsers: chatRoom.chatRoomUsers.map(value => ChatRoomUser.toDto(value)),
      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt
    }
  }
}
