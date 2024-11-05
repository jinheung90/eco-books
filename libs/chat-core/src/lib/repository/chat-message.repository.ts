
import { Injectable } from '@nestjs/common';
import { ChatMessage } from '../entity/chat-message';
import { Repository } from 'typeorm';


@Injectable()
export class ChatMessageRepository extends Repository<ChatMessage> {




}
