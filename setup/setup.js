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

export default [
  { schema: ArticleSchema, seed: articles_seed },
  { schema: CalendarEventSchema, seed: calendar_event_seed },
  { schema: IssueMapSchema, seed: issue_map_seed },
  { schema: PhotoTagSchema, seed: photo_tag_seed },
  { schema: PhotoSchema, seed: photo_seed },
  { schema: UserSchema, seed: user_seed },
];
