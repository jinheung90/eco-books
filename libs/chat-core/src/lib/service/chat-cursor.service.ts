import { Injectable } from '@nestjs/common';
import { ChatCursorRepository } from '../repository/chat-cursor.repository';

@Injectable()
export class ChatCursorService {

  constructor(private readonly chatCursorRepository: ChatCursorRepository) {
  }


}
