import UserController from "../controllers/userController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";

/* Controls Routing for Users */

// Create a function to register user routes
async function userRoutes(fastify, options) {
  // Route for logging in
  fastify.route({
    method: "POST",
    url: "/login",
    handler: UserController.login,
  });

  // Route for signing up
  fastify.route({
    method: "POST",
    url: "/signup",
    handler: UserController.signup,
  });

  // Route for filtering users by options: graduation years, statuses, roles
  fastify.route({
    method: "GET",
    url: "/filter",
    handler: async (request, reply) => {
      // Implement logic for filtering users
    },
  });

  // Route for getting a single user by username
  fastify.route({
    method: "GET",
    url: "/username/:username",
    handler: UserController.getPublicUserByUsername,
  });

  // Admin route for approving/denying a list of users
  fastify.route({
    method: "PUT",
    url: "/resolve-status",
    preHandler: Authorize.allow([Accounts.Admin]),
    handler: UserController.resolveUserApprovals,
  });

  // Admin route for updating a user, including adding/removing roles
  fastify.route({
    method: "PUT",
    url: "/update/:username",
    preHandler: Authorize.allow([Accounts.Admin]),
    handler: async (request, reply) => {
      const { username } = request.params;
      // Implement user update logic
    },
  });

  // Route for getting the current user's profile
  fastify.route({
    method: "GET",
    url: "/me",
    preHandler: Authorize.allow(Accounts.list()),
    handler: UserController.getMyProfile,
  });

  // Route for updating the currently signed-in account
  fastify.route({
    method: "PUT",
    url: "/me/update",
    preHandler: Authorize.allow(Accounts.list()),
    handler: async (request, reply) => {
      // Implement profile update logic
    },
  });
}

// Export the function that registers the routes
export default userRoutes;
