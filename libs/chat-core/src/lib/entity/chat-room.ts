import {
  Column,
  CreateDateColumn,
  Entity,

  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ChatRoomUser } from './chat-room-user';

@Entity()
export class ChatRoom {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userBookId: number;

  @OneToMany(type => ChatRoomUser, chatRoomUser => chatRoomUser.chatRoom)
  chatRoomUsers: ChatRoomUser[];

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @Column()
  activity: boolean;
}
