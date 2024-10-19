// Function to register photo tag routes
async function photoTagRoutes(fastify, options) {

  // Route for creating a photo tag
  fastify.route({
    method: "POST",
    url: "/create",
    handler: async (request, reply) => {
      // Handle photo tag creation logic
      reply.send({ message: "Photo tag created!" });
    },
  });

  // Route for getting a tag by its name
  fastify.route({
    method: "GET",
    url: "/tag-name/:tagName",
    handler: async (request, reply) => {
      const { tagName } = request.params;
      // Handle logic to get tag by name
      reply.send({ tagName });
    },
  });

  // Route for getting photo tags filtered by colors, creating users, etc.
  fastify.route({
    method: "GET",
    url: "/filter",
    handler: async (request, reply) => {
      // Handle filtering logic for photo tags
      reply.send({ message: "Filtered photo tags" });
    },
  });

  // Route for updating a photo tag by its name
  fastify.route({
    method: "PUT",
    url: "/update/:tagName",
    handler: async (request, reply) => {
      const { tagName } = request.params;
      // Handle logic to update the photo tag
      reply.send({ message: `Photo tag ${tagName} updated!` });
    },
  });

  // Route for deleting a photo tag by its name
  fastify.route({
    method: "DELETE",
    url: "/delete/:tagName",
    handler: async (request, reply) => {
      const { tagName } = request.params;
      // Handle logic to delete the photo tag
      reply.send({ message: `Photo tag ${tagName} deleted!` });
    },
  });
}

// Export the function to register the photo tag routes
export default photoTagRoutes;
