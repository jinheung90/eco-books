import { createClient, RedisClientType, RedisDefaultModules, RedisFunctions, RedisModules, RedisScripts } from 'redis';
import { EnvironmentName } from '@eco-books/type-common';
import { Logger } from '@nestjs/common';

export class RedisClient {
  async
  protected logger = new Logger(RedisClient.name);
  private client: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;

  async mgetData<T>(keys: string[]) {
    const values = await this.client.mGet(keys);
    if(!values) {
      return null;
    }
    return values.map((v) => JSON.parse(v) as T);
  }

  async getData<T>(key: string) {
    const result = await this.client.get(key);
    if(!result) {
      return null;
    }
    return JSON.parse(result) as T;
  }

  async getSet<T>(key: string, value: T) {
    return await this.client.getSet(key, JSON.stringify(value));
  }

  async deleteData(key: string) {
    await this.client.del(key);
  }

  async hSet<T>(key: string, subKey: string, value: T) {
    return this.client.hSet(key, subKey, JSON.stringify(value));
  }

  async setData<T>(key: string, value: T, ttl: number) {
    await this.client.set(key, JSON.stringify(value));
    if(ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async zRem<T>(key: string, value: T) {
    return this.client.zRem(key, JSON.stringify(value));
  }

  async flushAll() {
    if(process.env['APP_ENV'] === EnvironmentName.PROD) {
      this.logger.fatal('운영환경에서는 삭제 불가능합니다.')
      return;
    }
    await this.client.flushAll();
  }

  protected async setRedisClient(url: string, database: number) {
    this.client = await createClient({
      url: url,
      database: database,
    }).on('error', err =>
      this.logger.error(`error connect redis err: ${err}`)
    ).connect();

  }

  protected getRedisClient() {
    return this.client;
  }
}

