import { EnvironmentName } from '@eco-books/type-common';
import { Logger } from '@nestjs/common';
import { ZResultWithScoreDao } from '../dao/redis.dao';
import {
  createClient,
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

export class RedisClient {
  protected logger = new Logger(RedisClient.name);
  protected client;
  protected url: string;
  protected db: number;

  async mGetData<T>(keys: string[]): Promise<T[]> {
    const values = await this.getRedisClient().mGet(keys);
    if (!values) {
      return new Array<T>();
    }
    return values.map((v: string) => {
      return JSON.parse(v) as T;
    });
  }

  async getData<T>(key: string) {
    const result = await this.getRedisClient().get(key);
    if (!result) {
      return {} as T;
    }
    return JSON.parse(result) as T;
  }

  async getSet<T>(key: string, value: T) {
    return await this.getRedisClient().getSet(key, JSON.stringify(value));
  }

  async deleteData(key: string) {
    await this.getRedisClient().del(key);
  }

  async hSet<T>(key: string, subKey: string, value: T) {
    return this.client.hSet(key, subKey, JSON.stringify(value));
  }

  async setData<T>(key: string, value: T, ttl?: number) {
    await this.getRedisClient().set(key, JSON.stringify(value));
    if (ttl) {
      await this.getRedisClient().expire(key, ttl);
    }
  }

  // TODO 오류
  // async zRem<T>(key: string, value: T) {
  //   return this.client.zRem(key, JSON.stringify(value));
  // }

  async zAdd<T>(key: string, score: number, value: T) {
    return this.client.zAdd(key, [
      { value: JSON.stringify(value), score: score },
    ]);
  }

  async incr(key: string) {
    await this.client.incr(key);
  }

  async pageZRangeWithScores<T>(
    key: string,
    offset: number,
    count: number
  ): Promise<ZResultWithScoreDao<T>[]> {
    const res = await this.client.zRangeWithScores(key, 0, -1, {
      REV: true,
      LIMIT: {
        offset,
        count,
      },
    });

    return res.map(
      (value) =>
        new ZResultWithScoreDao(JSON.parse(value.value) as T, value.score)
    );
  }

  async flushAll() {
    if (process.env['APP_ENV'] === EnvironmentName.PROD) {
      this.logger.fatal('운영환경에서는 삭제 불가능합니다.');
      return;
    }
    await this.client.flushAll();
  }

  public async setRedisClient() {
    this.client = await createClient()
      .on('error', (err) =>
        console.error(err)
      )
      .on('connect', () => this.logger.log('connect redis'))
      .connect();
  }

  protected getRedisClient() {
    if (!this.client) {

      this.setRedisClient().then();
    }
    return this.client;
  }
}

