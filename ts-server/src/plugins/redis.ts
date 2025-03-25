import fastifyPlugin from "fastify-plugin";
import fastifyRedis from "@fastify/redis";
import { FastifyInstance } from "fastify";

async function redis(fastify: FastifyInstance) {
  fastify.register(fastifyRedis, {
    url: process.env.REDIS_URL,
  });
}

export default fastifyPlugin(redis);