import { FastifyRedis } from "@fastify/redis";

// Helper function to cache and retrieve from Redis
export const getFromCache = async (key: string, redis: any): Promise<any> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, data: any, redis: FastifyRedis) => {
  redis.setex(key, 300, JSON.stringify(data)); // 5 minutes
};
