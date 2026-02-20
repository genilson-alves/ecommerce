import redis from '../../config/redis';

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, data: any, ttlSeconds: number) => {
  await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
};
