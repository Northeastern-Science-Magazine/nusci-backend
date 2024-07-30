import ArticleStatus from "../../app/models/enums/article_status.js";

export const validArticleStatusUpdate = {
  articleStatus: ArticleStatus.Print.status,
};

export const invalidArticleStatusUpdate = {
  articleStatus: "unknown_status",
};

export const validAuthorsUpdate = {
  authors: ["anika", "jasmine"],
  authorsIDs: ["b00000000000000000000012", "b00000000000000000000008"],
};

export const emptyAuthorsUpdate = {
  authors: [],
};

export const invalidAuthorsUpdate = {
  authors: ["invalidUsername"],
};

export const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
export const invalidArticleSlug = "invalid-article-slug";
