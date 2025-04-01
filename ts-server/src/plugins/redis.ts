import fastifyPlugin from "fastify-plugin";
import fastifyRedis from "@fastify/redis";
import { FastifyInstance } from "fastify";

async function redis(fastify: FastifyInstance) {
  fastify.register(fastifyRedis, {
    url: process.env.REDIS_URL,
  });

  fastify.after(() => {
    if (fastify.redis) {
      fastify.log.info("Redis connected successfully!");
      fastify.redis.on("error", (err) => {
        fastify.log.error(`Redis connection error: ${err.message}`);
      });
    } else {
      fastify.log.error("Redis failed to connect.");
    }
  });
}

export default fastifyPlugin(redis);
