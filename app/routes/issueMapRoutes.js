async function router(fastify, options) {
  // Define a POST route for creating an item
  fastify.route({
    method: 'POST', // Specify the HTTP method
    url: '/create', // Define the route URL
    handler: async (request, reply) => {

      const data = request.body;

      reply.send({ message: 'Item created successfully', data });
    },
  });
}

export default router;
