import { io, Socket } from 'socket.io-client';
import { ChatMessageDto } from '@eco-books/type-common';



abstract class WsBase {
  protected socket: Socket;
  constructor(url: string, prefix: string, token: string) {
    if(!url) {
      throw new Error();
    }
    console.log(url + prefix);
    this.socket = io(url + prefix, {
      autoConnect: false,
      extraHeaders: {
        authorization: `Bearer ${token}`
      }
    });
    this.subscribes();
    this.connect();
  }

  connect() {
    this.socket.connect();
  }
  disConnect() {
    if(this.socket.connected) {
      this.disConnect();
    }
  }
  getClientId() {
    return this.socket.id;
  }

  protected abstract subscribes(): string;

  protected abstract errorHandlerSub(): boolean;

}

export class ChatWsClient extends WsBase {

  private userId: number;
  protected logMessages: string[];
  protected responseDatas: string[];
  constructor(url: string, prefix: string, token: string, userId: number) {
    super(url, prefix, token);
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }

  protected errorHandlerSub(): boolean {
    return false;
  }

  public sendToMessage<T>(path: string, data: T) {
    this.socket.send(path, data);
  }

  protected subscribes(): string {
    this.socket.on("income-book-detail", (res) => {
      this.logMessages.push(JSON.stringify(res))
      console.log(res);
    }).on("receive", res => {
      const data = JSON.parse(res) as ChatMessageDto;
      if(data.sendClientId === this.getClientId()) {
        this.logMessages.push('중복 채팅 업데이트')
        return;
      }
      // 채팅 추가
      this.logMessages.push(JSON.stringify(res))
    });
    return '';
  }
  getMessageCount() {
    return this.logMessages.length;
  }
}
