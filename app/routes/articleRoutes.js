import ArticlesController from "../controllers/articleController.js";
import Authorize from "../auth/authorization.js";
import Accounts from "../models/enums/accounts.js";
import { articleUpdateSchema, articleResponseSchema } from "../models/apiModels/articleValidation.js";

/* Controls Routing for Finished Articles */
async function router(fastify, options) {
  /*
  // Create an article (you need to define the method and controller here)
  fastify.route({
    method: "POST",
    url: "/create",
    // implement handler
  });

  // Get articles approved by the given user
  fastify.route({
    method: "GET",
    url: "/approved-by/:username",
    // implement handler
  });

  // Get article by its unique slug
  fastify.route({
    method: "GET",
    url: "/slug/:slug",
    // implement handler
  });

  // Update the issue number of this article (admin only)
  fastify.route({
    method: "PATCH",
    url: "/set-issue-number/:slug",
    preHandler: Authorize.allow([Accounts.Admin]),
    // implement handler
  });
  */

  // Update the article status (admin only)
  fastify.route({
    method: "PATCH",
    url: "/article-status/:slug",
    preHandler: Authorize.allow([Accounts.Admin]),
    /*
    schema: {
      body: articleUpdateSchema,
      response: {
        200: articleResponseSchema,
      },
    },
    */
    handler: ArticlesController.updateStatus,
  });

  /*
  // Update writing status (you need to define the handler in ArticlesController)
  fastify.route({
    method: "PATCH",
    url: "/writing-status/:slug",
    // implement handler
  });

  // Admin/EIC approve article to go live on the site
  fastify.route({
    method: "PATCH",
    url: "/admin-approve/:slug",
    // implement handler
  });

  // Update design status
  fastify.route({
    method: "PATCH",
    url: "/design-status/:slug",
    // implement handler
  });

  // Update photography status
  fastify.route({
    method: "PATCH",
    url: "/photography-status/:slug",
    // implement handler
  });
  */

  // Update authors (admin only)
  fastify.route({
    method: "PATCH",
    url: "/authors/:slug",
    preHandler: Authorize.allow([Accounts.Admin]),
    handler: ArticlesController.updateAuthors,
  });

  /*
  // Update editors for an article
  fastify.route({
    method: "PATCH",
    url: "/editors/:slug",
    // implement handler
  });

  // Update designers for an article
  fastify.route({
    method: "PATCH",
    url: "/designers/:slug",
    // implement handler
  });

  // Update photographers for an article
  fastify.route({
    method: "PATCH",
    url: "/photographers/:slug",
    // implement handler
  });

  // Update article content (you need to clarify who can update)
  fastify.route({
    method: "PATCH",
    url: "/update/:slug",
    // implement handler
  });

  // Delete an article
  fastify.route({
    method: "DELETE",
    url: "/delete/:slug",
    // implement handler
  });
  */

  // Add internal comment to an article (editor or admin only)
  fastify.route({
    method: "POST",
    url: "/add-internal-comment/:slug",
    preHandler: Authorize.allow([Accounts.Admin, Accounts.Editor]),
    handler: ArticlesController.addInternalComment,
  });
}

export default router;
