import fastify from "fastify";
import mercurius from "mercurius";
import postgres from "./plugins/postgres";
import { typeDefs } from "./graphql/schema/mergeTypeDef";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { context } from "./context";

const server = fastify({
  logger: true,
});

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
  // TODO add resolvers here.
  graphiql: true,
  // TODO make sure this syntax works
  context: () => context,
});

server.listen({ port: 4000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
