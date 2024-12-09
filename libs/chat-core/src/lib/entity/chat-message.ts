import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ChatMessageDto, ChatMessageType } from '@eco-books/type-common';


@Entity()
export class ChatMessage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  chatRoomId: number;

  @Column()
  posId: number;

  @Column({length: 500})
  context: string;

  @Column({type: "enum", enum: ChatMessageType, default: ChatMessageType.text})
  messageType: ChatMessageType;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @Column()
  activity: boolean;

  static toDto(chatMessage: ChatMessage): ChatMessageDto {
    return {
      id: chatMessage.id,
      userId: chatMessage.userId,
      chatRoomId: chatMessage.chatRoomId,
      chatMessageType: chatMessage.messageType,
      message: chatMessage.context,
      createdAt: chatMessage.createdAt
    }
  }
}


