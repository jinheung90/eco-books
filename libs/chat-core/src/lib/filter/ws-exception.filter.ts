import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch(WsException, HttpException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  override catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
    const details = error instanceof Object ? { ...error } : { message: error };
    client.send(JSON.stringify({
      event: "error",
      data: {
        id: client.id,
        message: details
      }
    }));
  }
}
