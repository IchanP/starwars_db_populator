import fastify, { FastifyInstance } from "fastify";
import mercurius from "mercurius";
import postgres from "./plugins/postgres";
import { typeDefs } from "./graphql/schema/mergeTypeDef";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import { resolvers } from "./graphql/resolvers/resolver";
import { resolvers as cacheResolvers } from "./graphql/resolvers/ex2/cache/resolver";
import redis from "./plugins/redis";
import dotenv from "dotenv";

dotenv.config();

interface CustomServer extends FastifyInstance {
  prisma: PrismaClient;
}

const server = fastify({
  logger: true,
}) as unknown as CustomServer;

server.decorate("prisma", new PrismaClient());

server.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// Database
server.register(postgres);

// Redis
server.register(redis);

const schema = makeExecutableSchema({
  typeDefs,
});
const schemaTwo = makeExecutableSchema({
  typeDefs,
});

server.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
  path: "/ex2/batch",
  allowBatchedQueries: true,
  context: () => {
    return {
      prisma: server.prisma,
    };
  },
});

server.register(mercurius, {
  schema: schemaTwo,
  resolvers: cacheResolvers,
  graphiql: true,
  path: "/ex2/cache",
  context: () => ({
    prisma: server.prisma,
    redis: server.redis,
  }),
});

server.listen({ port: 4000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
