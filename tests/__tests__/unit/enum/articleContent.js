import { log } from "../../../testConfig.js";
import ArticleContent from "../../../../app/models/enums/articleContent.js";
import { ErrorValidation } from "../../../../app/error/errors.js";

describe("Tests for enumerated type ArticleContent", () => {
  test("toString Text", () => {
    expect(ArticleContent.Text.toString()).toStrictEqual("text");
  });

  test("toString PullQuote", () => {
    expect(ArticleContent.PullQuote.toString()).toStrictEqual("pull_quote");
  });

  test("toString Image", () => {
    expect(ArticleContent.Image.toString()).toStrictEqual("image");
  });

  test("toString Link", () => {
    expect(ArticleContent.Link.toString()).toStrictEqual("link");
  });

  test("toArticleContent Text", () => {
    expect(ArticleContent.toArticleContent("text")).toStrictEqual(ArticleContent.Text);
  });

  test("toArticleContent PullQuote", () => {
    expect(ArticleContent.toArticleContent("pull_quote")).toStrictEqual(ArticleContent.PullQuote);
  });

  test("toArticleContent Image", () => {
    expect(ArticleContent.toArticleContent("image")).toStrictEqual(ArticleContent.Image);
  });

  test("toArticleContent Link", () => {
    expect(ArticleContent.toArticleContent("link")).toStrictEqual(ArticleContent.Link);
  });

  test("toArticleContent invalid input", () => {
    expect(() => {
      ArticleContent.toArticleContent("invalid");
    }).toThrow(ErrorValidation);
  });

  test("list ArticleContent", () => {
    expect(ArticleContent.list()).toStrictEqual([
      ArticleContent.Text,
      ArticleContent.PullQuote,
      ArticleContent.Image,
      ArticleContent.Link,
    ]);
  });

  test("listr ArticleContent", () => {
    expect(ArticleContent.listr()).toStrictEqual(["text", "pull_quote", "image", "link"]);
  });
});
