import ArticleSchema from "../api/models/article.js";
import CalendarEventSchema from "../api/models/calendar_event.js";
import IssueMapSchema from "../api/models/issue_map.js";
import PhotoTagSchema from "../api/models/photo_tag.js";
import PhotoSchema from "../api/models/photo.js";
import UserSchema from "../api/models/user.js";

import articles_seed from "./seed/articles_seed.js";
import calendar_event_seed from "./seed/calendar_event_seed.js";
import issue_map_seed from "./seed/issue_map_seed.js";
import photo_tag_seed from "./seed/photo_tag_seed.js";
import photo_seed from "./seed/photo_seed.js";
import user_seed from "./seed/user_seed.js";

import Connection from "../api/db/connection.js";

process.stdout.write("Reseeding database...\n");

try {
  await Connection.open();
  await Promise.all([
    createDocuments(ArticleSchema, articles_seed),
    createDocuments(CalendarEventSchema, calendar_event_seed),
    createDocuments(IssueMapSchema, issue_map_seed),
    createDocuments(PhotoTagSchema, photo_tag_seed),
    createDocuments(PhotoSchema, photo_seed),
    createDocuments(UserSchema, user_seed),
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

