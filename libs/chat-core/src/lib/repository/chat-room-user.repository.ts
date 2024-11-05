import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatRoomUser } from '../entity/chat-room-user';

@Injectable()
export class ChatRoomUserRepository extends Repository<ChatRoomUser>{


}
