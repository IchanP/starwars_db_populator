import Fastify from 'fastify'
import postgres from './plugins/postgres.js'
import 'dotenv/config';
import mercurius from 'mercurius';
import { typeDefs } from './graphql/schema/mergeTypeDefs.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { context } from './context.js';

const fastify = Fastify({
  logger: true
})

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

// Database
fastify.register(postgres)

const schema = makeExecutableSchema({
  typeDefs,
});

fastify.register(mercurius, {
  schema,
  // TODO: Add resolvers here.
  graphiql: true,
  context
})

fastify.listen({ port: 4000 }, function (err) {
  if (err) {
    fastify.log.error(err)
    // eslint-disable-next-line no-undef
    process.exit(1)
  }
})


const shutdown = async () => {
  console.log('Shutting down gracefully...');
  const prisma = context()
  await prisma.$disconnect(); // Disconnect Prisma
  await fastify.close(); // Close Fastify server
  console.log('Server has been gracefully shut down.');
  // eslint-disable-next-line no-undef
  process.exit(0);
};

// eslint-disable-next-line no-undef
process.on('SIGINT', shutdown);
// eslint-disable-next-line no-undef
process.on('SIGTERM', shutdown);