import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ChatCursorCacheDao } from '@eco-books/type-common';

@Injectable()
export class ChatCacheService {
  private readonly CHAT_CURSOR_PREFIX: string = "chat_cursor_prefix:"

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async updateCursor(chatRoomUserId: number, chatMessageId: number) {
    const dao: ChatCursorCacheDao = {
      chatMessageId: chatMessageId,
      chatRoomUserId: chatMessageId,
      updateAt: new Date()
    }
    await this.cacheManager.set(this.CHAT_CURSOR_PREFIX + chatRoomUserId, dao);
  }
}
