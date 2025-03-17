import Fastify from 'fastify'
import postgres from './plugins/postgres.js'
import 'dotenv/config';
import mercurius from 'mercurius';
import { typeDefs } from './graphql/schema/mergeTypeDefs.js';
import { makeExecutableSchema } from '@graphql-tools/schema';

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
  graphiql: true
})

fastify.listen({ port: 4000 }, function (err) {
  if (err) {
    fastify.log.error(err)
    // eslint-disable-next-line no-undef
    process.exit(1)
  }
})