import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class ChatCursor {
  @Prop()
  userId: number;
  @Prop()
  chatHistoryId: string;
  @Prop()
  roomId: string;
}

export const ChatCursorSchema = SchemaFactory.createForClass(ChatCursor);
