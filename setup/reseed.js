import RegisteredUserSchema from "../api/models/user.registered.js";
import UnregisteredUserSchema from "../api/models/user.unregistered.js";
import ArticleSchema from "../api/models/article.js";
import PendingArticleSchema from "../api/models/pending.article.js";

import registered_users_seed from "./seed/registered_users_seed.js";
import unregistered_users_seed from "./seed/unregistered_users_seed.js";
import articles_seed from "./seed/articles_seed.js";
import pending_articles_seed from "./seed/pending_articles_seed.js";

import Connection from "../api/db/connection.js";

process.stdout.write("Reseeding database...\n");

try {
  await Connection.open();
  await Promise.all([
    createDocuments(RegisteredUserSchema, registered_users_seed),
    createDocuments(UnregisteredUserSchema, unregistered_users_seed),
    createDocuments(ArticleSchema, articles_seed),
    createDocuments(PendingArticleSchema, pending_articles_seed)
  ]);
  await Connection.close();
  process.exit();
} catch (error) {
  process.stdout.write("Error while reseeding database: " + error + "\n");
  process.exit(1);
}

/**
 *
 * @param {*} schema
 * @param {*} documents
 */
async function createDocuments(schema, documents) {
  for (const doc of documents) {
    await schema.create(doc);
  }
}

