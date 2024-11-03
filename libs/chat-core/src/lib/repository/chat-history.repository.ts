import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ChatHistory } from '../entity/chat-history';
import { Model } from 'mongoose';

@Injectable()
export class ChatHistoryRepository {

  constructor(
    @InjectModel(ChatHistory.name)
    private readonly chatHistoryModel: Model<ChatHistory>
  ) {}

  save(t: ChatHistory) {
    return this.chatHistoryModel.create(t).then();
  }

//  TODO
//  findAllByRoomIdAndChatId() {}
}
