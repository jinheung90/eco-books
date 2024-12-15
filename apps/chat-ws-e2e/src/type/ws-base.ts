import { io } from 'socket.io-client';
import { JwtStorage } from '../JwtStorage';


export abstract class WsBase {

  protected socket;
  private jwtStorage = new JwtStorage();
  constructor(url: string, prefix: string) {
    if(!url) {
      throw new Error();
    }
    console.log(url + prefix);
    this.socket = io(url + prefix, {
      autoConnect: false,
      extraHeaders: {
        authorization: `Bearer ${this.jwtStorage.getAccessToken()}`
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

  protected abstract subscribes(): string;

  protected abstract errorHandlerSub(): boolean;

}
