import Fastify from 'fastify';

// Create a Fastify instance
const fastify = Fastify(); 

// Function to define routes
async function routes(fastifyInstance, options) {

    // Define your routes here
    fastifyInstance.route({
        method: "GET",
        url: "/example",
        handler: async (request, reply) => {
            reply.send({ message: "This is an example route!" });
        },
    });

}

// Register the routes
fastify.register(routes);

export default routes;
