import ArticleSchema from "../app/models/dbModels/article.js";
import IssueMapSchema from "../app/models/dbModels/issueMap.js";
import PhotoTagSchema from "../app/models/dbModels/photoTag.js";
import PhotoSchema from "../app/models/dbModels/photo.js";
import UserSchema from "../app/models/dbModels/user.js";

import articles_seed from "./seed/articles_seed.js";
import issue_map_seed from "./seed/issue_map_seed.js";
import photo_tag_seed from "./seed/photo_tag_seed.js";
import photo_seed from "./seed/photo_seed.js";
import user_seed from "./seed/user_seed.js";

export default [
  { schema: ArticleSchema, seed: articles_seed },
  { schema: IssueMapSchema, seed: issue_map_seed },
  { schema: PhotoTagSchema, seed: photo_tag_seed },
  { schema: PhotoSchema, seed: photo_seed },
  { schema: UserSchema, seed: user_seed },
];
