import fastifyPlugin from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'

/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
async function postgres (fastify) {
  fastify.register(fastifyPostgres, {
    // eslint-disable-next-line no-undef
    url: process.env.DATABASE_URL
  })
}

export default fastifyPlugin(postgres)