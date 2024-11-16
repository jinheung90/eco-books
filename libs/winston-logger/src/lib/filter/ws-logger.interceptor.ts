import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from 'winston';


@Injectable()
export class WsLoggerInterceptor implements NestInterceptor {
  private logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const socket = context.switchToWs().getClient();
    this.logger.log(socket);
    this.logger.log(socket.getData());
    return next.handle();

  }
}
