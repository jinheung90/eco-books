import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatCursor } from '../entity/chat-cursor';
import { Model } from 'mongoose';

@Injectable()
export class ChatCursorRepository {
  constructor(
    @InjectModel(ChatCursor.name)
    private readonly chatCursorModel: Model<ChatCursor>
  ) {}

  save(t: ChatCursor) {
    return this.chatCursorModel.create(t).then();
  }
}
