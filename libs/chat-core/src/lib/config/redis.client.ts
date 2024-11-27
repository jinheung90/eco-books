import Redis from 'ioredis';

export class RedisClient {
  private redis: Redis;

  protected setRedisClient(url: string) {
    this.redis = new Redis({
      host: url,
    });
  }

  protected getRedisClient() {
    return this.redis;
  }

  async mgetData<T>(keys: string[]) {
    const values = await this.redis.mget(keys);
    return values.map((v) => JSON.parse(v) as T);
  }

  async getData<T>(key: string) {
    return JSON.parse(await this.redis.get(key)) as T;
  }


  async setData<T>(key: string, value: T, ttl: number) {
    return this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async zadd<T>(key: string, sortValue: number, value: T) {
    return this.redis.zadd(key, sortValue, JSON.stringify(value));
  }

  async zscan<T>(key: string, count: number): Promise<{
    cursor: string,
    elements: T[]
  }> {
    return await this.redis.z(key, count)
      .then(
        res => {
          return {
            elements: res.map(value => JSON.parse(value) as T)
          }
        }
      );
  }

  async zrem<T>(key: string, value: T) {
    return this.redis.zrem(key, JSON.stringify(value));
  }

}

