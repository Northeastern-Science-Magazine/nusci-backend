import { log } from "../../../testConfig.js";
import ArticleContent from "../../../../app/models/enums/articleContent.js";
import { ErrorValidation } from "../../../../app/error/errors.js";


describe("Tests for enumerated type ArticleContent", () => {
  test("toString BodyParagraph", () => {
    expect(ArticleContent.BodyParagraph.toString()).toStrictEqual("body_paragraph");
  });

  test("toString PullQuote", () => {
    expect(ArticleContent.PullQuote.toString()).toStrictEqual("pull_quote");
  });

  test("toString Image", () => {
    expect(ArticleContent.Image.toString()).toStrictEqual("image");
  });

  test("toArticleContent BodyParagraph", () => {
    expect(ArticleContent.toArticleContent("body_paragraph")).toStrictEqual(ArticleContent.BodyParagraph);
  });

  test("toArticleContent PullQuote", () => {
    expect(ArticleContent.toArticleContent("pull_quote")).toStrictEqual(ArticleContent.PullQuote);
  });

  test("toArticleContent Image", () => {
    expect(ArticleContent.toArticleContent("image")).toStrictEqual(ArticleContent.Image);
  });

  test("toArticleContent invalid input", () => {
    expect(() => {
      ArticleContent.toArticleContent("invalid");
    }).toThrow(ErrorValidation);
  });

  test("list ArticleContent", () => {
    expect(ArticleContent.list()).toStrictEqual([
      ArticleContent.BodyParagraph,
      ArticleContent.PullQuote,
      ArticleContent.Image,
    ]);
  });

  test("listr ArticleContent", () => {
    expect(ArticleContent.listr()).toStrictEqual(["body_paragraph", "pull_quote", "image"]);
  });
});
