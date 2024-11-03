import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ChatRoom } from '../entity/chat-room';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
    private readonly configService: ConfigService,
  ) {}

  save(t: ChatRoom) {
    return this.chatRoomModel.create(t).then();
  }

  async findByUserIdAndUserBookId(userId: number[], userBookId: number) {
    return this.chatRoomModel.findOne({
      userId: userId,
      userBookId: userBookId
    });
  }
}
