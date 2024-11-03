import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class ChatRoom {
  @Prop()
  userId: number[];
  @Prop()
  userBookId: number;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
