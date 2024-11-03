import { IoAdapter } from '@nestjs/platform-socket.io';

import { createShardedAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { Logger } from '@nestjs/common';



export class RedisIoAdapter extends IoAdapter {

  private readonly adapter: ReturnType<typeof createShardedAdapter>;
  private logger = new Logger(RedisIoAdapter.name)
  constructor(url: string) {
    super();
    const pubClient = createClient({ url: url });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()]).then();
    this.adapter = createShardedAdapter(pubClient, subClient);
  }
  override createIOServer(port: number, options?: ServerOptions): unknown {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapter);
    return server;
  }
}
