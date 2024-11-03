import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { UserBookCheckDto } from '@eco-books/type-common';
import { WsException } from '@nestjs/websockets';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class BookServiceClients {

  private USER_BOOK_CHECK_PATH = "/{id}/chatting/check";
  private userServiceUrl;
  private logger = new Logger(BookServiceClients.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.USER_BOOK_CHECK_PATH + this.configService.get<string>('USER_SERVICE_URL');
  }

  async getBookInfoByUserBookId(userBookId: number)  {
    let url = this.userServiceUrl;
    url = url.replace(userBookId.toString(), '{id}');
    const { data } = await firstValueFrom(this.httpService.get<UserBookCheckDto>(url)
      .pipe(
        catchError((error: AxiosError) => {
          throw new WsException("book client error " + url)
        }),
      ),
    );
    return data;
  }
}
