import ArticleSchema from "../api/models/article.js";
import CalendarEventSchema from "../api/models/calendar_event.js";
import IssueMapSchema from "../api/models/issue_map.js";
import PhotoTagSchema from "../api/models/photo_tag.js";
import PhotoSchema from "../api/models/photo.js";
import UserSchema from "../api/models/user.js";

import Connection from "../api/db/connection.js";

process.stdout.write("Dropping all collections...\n");

try {
  await Connection.open();
  await Promise.all([
    ArticleSchema.collection.drop(),
    CalendarEventSchema.collection.drop(),
    IssueMapSchema.collection.drop(),
    PhotoTagSchema.collection.drop(),
    PhotoSchema.collection.drop(),
    UserSchema.collection.drop(),
  ]);
  await Connection.close();
  process.exit();
} catch (error) {
  process.stdout.write("Error while dropping database: " + error + "\n");
  process.exit(1);
}