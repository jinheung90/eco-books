
import Redis from 'ioredis';

export class RedisClient {
  private redis: Redis;
  setRedisClient(url: string) {
    this.redis = new Redis({
      host: url,
    })
  }

  getRedisClient() {
    return this.redis;
  }

  async getArrayData<T>(keys: string[]) {
    const values = await this.redis.mget(keys);
    return values.map(v => JSON.parse(v) as T);
  }

  async setData<T>(key: string, value: T, ttl: number) {
    return this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

}
