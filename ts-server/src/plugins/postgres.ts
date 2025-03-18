import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";
import { FastifyInstance } from "fastify";

async function postgres(fastify: FastifyInstance) {
  fastify.register(fastifyPostgres, {
    url: process.env.DATABASE_URL,
  });
}

export default fastifyPlugin(postgres);
