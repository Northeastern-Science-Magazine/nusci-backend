import { log } from "../../../testConfig.js";
import ArticleStatus from "../../../../app/models/enums/articleStatus.js";
import { ErrorValidation } from "../../../../app/error/errors.js";

describe("Tests for enumerated type ArticleStatus", () => {
  test("toString Pending", () => {
    expect(ArticleStatus.Pending.toString()).toStrictEqual("pending");
  });

  test("toString Print", () => {
    expect(ArticleStatus.Print.toString()).toStrictEqual("print");
  });

  test("toString Online", () => {
    expect(ArticleStatus.Online.toString()).toStrictEqual("online");
  });

  test("toArticleStatus Pending", () => {
    expect(ArticleStatus.toArticleStatus("pending")).toStrictEqual(ArticleStatus.Pending);
  });

  test("toArticleStatus Print", () => {
    expect(ArticleStatus.toArticleStatus("print")).toStrictEqual(ArticleStatus.Print);
  });

  test("toArticleStatus Online", () => {
    expect(ArticleStatus.toArticleStatus("online")).toStrictEqual(ArticleStatus.Online);
  });

  test("toArticleStatus invalid input", () => {
    expect(() => {
      ArticleStatus.toArticleStatus("invalid");
    }).toThrow(ErrorValidation);
  });

  test("list ArticleStatus", () => {
    expect(ArticleStatus.list()).toStrictEqual([ArticleStatus.Pending, ArticleStatus.Print, ArticleStatus.Online]);
  });

  test("listr ArticleStatus", () => {
    expect(ArticleStatus.listr()).toStrictEqual(["pending", "print", "online"]);
  });
});
