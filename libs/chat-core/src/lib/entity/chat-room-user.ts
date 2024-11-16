import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ChatRoom } from './chat-room';
import { ChatMessage } from './chat-message';
import { JoinColumn } from 'typeorm/browser';

@Entity()
export class ChatRoomUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  isHost: boolean;

  @OneToOne(() => ChatMessage)
  @JoinColumn({name: 'cursor_chat_message_id'})
  chatMessage: ChatMessage;

  @ManyToOne(type => ChatRoom, chatRoom => chatRoom.chatRoomUsers)
  chatRoom: ChatRoom;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}