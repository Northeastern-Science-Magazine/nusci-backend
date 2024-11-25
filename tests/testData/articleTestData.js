import ArticleStatus from "../../app/models/enums/articleStatus.js";

export const validArticleStatusUpdate = {
  articleStatus: ArticleStatus.Print.status,
};

export const invalidArticleStatusUpdate = {
  articleStatus: "unknown_status",
};

export const validAuthorsUpdate = {
  authors: ["anika@anika.com", "jasmine@jasmine.com"],
};

export const emptyAuthorsUpdate = {
  authors: [],
};

export const invalidAuthorsUpdate = {
  authors: ["invalidUsername"],
};

export const validArticleSlug = "exploring-the-future-ai-integration-in-everyday-life";
export const invalidArticleSlug = "invalid-article-slug";

export const validSearchQuery = "AI integration";
export const validSearchQuery2 = "Sweess";
export const validSearchQuery3 = "World";
export const InvalidSearchQuery = "NonexistentTopic";
export const InvalidSearchQuery2 = "ab23uyrbfvawoiu4grtREf982";
