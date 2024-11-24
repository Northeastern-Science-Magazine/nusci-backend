import Article, { ArticleSchema } from "../app/models/dbModels/article.js";
import IssueMap, { IssueMapSchema } from "../app/models/dbModels/issueMap.js";
import PhotoTag, { PhotoTagSchema } from "../app/models/dbModels/photoTag.js";
import Photo, { PhotoSchema } from "../app/models/dbModels/photo.js";
import User, { UserSchema } from "../app/models/dbModels/user.js";

import articles_seed from "./seed/articles_seed.js";
import issue_map_seed from "./seed/issue_map_seed.js";
import photo_tag_seed from "./seed/photo_tag_seed.js";
import photo_seed from "./seed/photo_seed.js";
import user_seed from "./seed/user_seed.js";

export default [
  { schema: ArticleSchema, seed: articles_seed, model: Article },
  { schema: IssueMapSchema, seed: issue_map_seed, model: IssueMap },
  { schema: PhotoTagSchema, seed: photo_tag_seed, model: PhotoTag },
  { schema: PhotoSchema, seed: photo_seed, model: Photo },
  { schema: UserSchema, seed: user_seed, model: User },
];
