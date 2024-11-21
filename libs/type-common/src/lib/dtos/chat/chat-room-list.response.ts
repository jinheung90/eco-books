export interface ChatRoomListResponse {
  chatPreviewList: Array<ChatPreviewDto>
}

export interface ChatPreviewDto {
  unreadChatCount: number,
  roomId: string,
  latestChatMessage: string
  latestChatCreatedAt: Date,
}

