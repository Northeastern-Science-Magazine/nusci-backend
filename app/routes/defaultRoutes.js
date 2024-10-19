import Connection from '../db/connection.js';
import { ErrorDatabaseConnection } from '../error/errors.js';

async function router(fastify, options) {
  // Route: Basic API connection test
  fastify.get('/', async (request, reply) => {
    reply.status(200).send({ message: 'Successfully connected to the NU Sci API!' });
  });

  // Route: Test database connection
  fastify.get('/db', async (request, reply) => {
    try {
      await Connection.open();  // Assuming this function connects to the DB
      reply.status(200).send({ message: 'Successfully connected to the NU Sci Database Instance!' });
    } catch (error) {
      console.error(error);
      // Handle the error through your custom error handler
      new ErrorDatabaseConnection().throwHttp(request, reply);
    } finally {
      await Connection.close(); // Ensure the connection is closed after handling
    }
  });
}

export default router;
