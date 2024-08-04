import ArticleStatus from "../../app/models/enums/articleStatus.js";

export const validArticleStatusUpdate = {
  articleStatus: ArticleStatus.Print.status,
};

export const invalidArticleStatusUpdate = {
  articleStatus: "unknown_status",
};

export const validAuthorsUpdate = {
  authors: ["anika", "jasmine"],
};

export const emptyAuthorsUpdate = {
  authors: [],
};

export const invalidAuthorsUpdate = {
  authors: ["invalidUsername"],
};

export const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
export const invalidArticleSlug = "invalid-article-slug";
