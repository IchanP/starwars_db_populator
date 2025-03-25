import fastify, { FastifyInstance } from "fastify";
import mercurius from "mercurius";
import postgres from "./plugins/postgres";
import { typeDefs } from "./graphql/schema/mergeTypeDef";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import { resolvers } from "./graphql/resolvers/resolver";
import { resolvers as cacheResolvers } from "./graphql/resolvers/ex2/cache/resolver";
import { Context } from "./context";

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

const schema = makeExecutableSchema({
  typeDefs,
});

server.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
  context: (request, reply): Partial<Context> => {
    return {
      prisma: server.prisma,
    };
  },
});

server.register(mercurius, {
  schema: schema,
  resolvers: cacheResolvers,
  graphiql: true,
  path: "/ex2/cache",
  context: (request, reply): Partial<Context> => ({
    prisma: server.prisma,
  }),
});


server.listen({ port: 4000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
