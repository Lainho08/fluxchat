import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

class InMemoryRedisClient {
  private store: Map<string, string> = new Map();
  private sets: Map<string, Set<string>> = new Map();
  private isConnected = true;

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string): Promise<'OK'> {
    this.store.set(key, value);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) count++;
      if (this.sets.delete(key)) count++;
    }
    return count;
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    if (!this.sets.has(key)) {
      this.sets.set(key, new Set());
    }
    const set = this.sets.get(key)!;
    let added = 0;
    for (const m of members) {
      if (!set.has(m)) {
        set.add(m);
        added++;
      }
    }
    return added;
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    const set = this.sets.get(key);
    if (!set) return 0;
    let removed = 0;
    for (const m of members) {
      if (set.delete(m)) removed++;
    }
    return removed;
  }

  async smembers(key: string): Promise<string[]> {
    const set = this.sets.get(key);
    return set ? Array.from(set) : [];
  }

  async scard(key: string): Promise<number> {
    const set = this.sets.get(key);
    return set ? set.size : 0;
  }
}

let redisInstance: Redis | InMemoryRedisClient;

try {
  const realRedis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 2) {
        logger.warn('⚠️ Redis server unreachable. Falling back to In-Memory Matchmaking Provider.');
        return null;
      }
      return 200;
    },
  });

  realRedis.on('error', (err) => {
    logger.warn(`Redis Connection Warning: ${err.message}`);
  });

  realRedis.on('connect', () => {
    logger.info('⚡ Connected to Redis Server');
  });

  redisInstance = realRedis;
} catch (error) {
  logger.warn('Failed to initialize Redis. Using In-Memory fallback store.');
  redisInstance = new InMemoryRedisClient();
}

export const redis = redisInstance;
