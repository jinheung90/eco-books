import axios from 'axios';
import { ChatWsClient } from './chat-ws.client';
import { LoginResponse } from '../type/user/dto/login.response';
import { ChatDto, ChatIncomeDto, ChatMessageType, MathFunction } from '@eco-books/type-common';

describe('chat ws test', () => {
  const chatWsClientMap: Map<number, Array<ChatWsClient>> = new Map<number, Array<ChatWsClient>>(); // 같은 유저가 여러 브라우저를 쓸 경우를 테스트
  const testServerHost = 'http://localhost:8081';
  const buyerId = 2;
  const sellerId = 3;
  const userBookId = 4;
  beforeEach(async () => {
    for (let i = 0; i < 2; i++) {
      const data = await axios.get<LoginResponse>(`https://book-service-prod.jin900920.com/api/v1/user/admin/${i + 2}`, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaXNzIjoidGVhbSIsIkF1dGhvcml0aWVzIjoiUk9MRV9VU0VSLFJPTEVfUk9PVCxST0xFX0FETUlOIiwiZXhwIjoxNzM1NDczNTEyfQ.2uNKuV8HPq1rynssWXz1IqjXo4jYoqL71DufsNVnb3c`,
        }
      }).then(res => res.data)

      const arrayClient = new Array<ChatWsClient>();
      const clientNum = MathFunction.randomInteger(2, 2);
      for (let j = 0; j < clientNum; j++) {
        const client = new ChatWsClient(testServerHost, 'chat', data.accessToken, data.id)
        client.connect();
        arrayClient.push(client);
      }
      chatWsClientMap.set(data.id, arrayClient);
    }
  })

  it('create client', async () => {
    expect(chatWsClientMap.size).toBe(150);
  });

  it('/chat/income-book-detail', async () => {
     const buyerClients = chatWsClientMap.get(buyerId);
     const sellerClients = chatWsClientMap.get(sellerId);
     let dto: ChatIncomeDto;
     dto = {
       sellerId: sellerId,
       userBookId: userBookId,
       chatRoomId: 0 // 책 상세에서 들어가는거라 기본적으로는 방이 없다고 가정한다.
     };
     buyerClients[0].sendToMessage('/income-book-detail', dto);
     buyerClients[1].sendToMessage('/income-book-detail', dto);
     sellerClients[0].sendToMessage('/income-book-detail', dto);
  });

  it('chatting', async () => {
    const buyerClients = chatWsClientMap.get(buyerId);
    const sellerClients = chatWsClientMap.get(sellerId);
    const dto: ChatDto = {
      chatRoomId: 1,
      message: "보내기 1",
      chatMessageType: ChatMessageType.text,
      clientId: buyerClients[0].getClientId(),
      sendUserId: buyerClients[0].getUserId(),
    }
    buyerClients[0].sendToMessage('/send', dto);
    dto.sendUserId = sellerClients[0].getUserId();
    dto.clientId = sellerClients[0].getClientId();
    dto.message = "보내기 2"
    sellerClients[0].sendToMessage('/send', dto);
  });
});
