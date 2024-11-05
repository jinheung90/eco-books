import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { MessageType } from '@eco-books/type-common';


@Entity()
export class ChatMessage {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  roomId: number;

  @Column({length: 500})
  context: string;

  @Column({type: "enum", enum: MessageType, default: MessageType.text})
  messageType: MessageType;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @Column()
  activity: boolean;
}


