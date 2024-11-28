import { log } from "../../../testConfig.js";
import CommentStatus from "../../../../app/models/enums/commentStatus.js";
import { ErrorValidation } from "../../../../app/error/errors.js";


describe("Tests for enumerated type CommentStatus", () => {
  test("toString Resolved", () => {
    expect(CommentStatus.Resolved.toString()).toStrictEqual("resolved");
  });

  test("toString Unresolved", () => {
    expect(CommentStatus.Unresolved.toString()).toStrictEqual("unresolved");
  });

  test("toString Public", () => {
    expect(CommentStatus.Public.toString()).toStrictEqual("public");
  });

  test("toString Reason", () => {
    expect(CommentStatus.Reason.toString()).toStrictEqual("reason");
  });

  test("toCommentStatus Resolved", () => {
    expect(CommentStatus.toCommentStatus("resolved")).toStrictEqual(CommentStatus.Resolved);
  });

  test("toCommentStatus Unresolved", () => {
    expect(CommentStatus.toCommentStatus("unresolved")).toStrictEqual(CommentStatus.Unresolved);
  });

  test("toCommentStatus Public", () => {
    expect(CommentStatus.toCommentStatus("public")).toStrictEqual(CommentStatus.Public);
  });

  test("toCommentStatus Reason", () => {
    expect(CommentStatus.toCommentStatus("reason")).toStrictEqual(CommentStatus.Reason);
  });

  test("toCommentStatus invalid input", () => {
    expect(() => {
      CommentStatus.toCommentStatus("invalid");
    }).toThrow(ErrorValidation);
  });

  test("list CommentStatus", () => {
    expect(CommentStatus.list()).toStrictEqual([CommentStatus.Resolved, CommentStatus.Unresolved, CommentStatus.Public, CommentStatus.Reason]);
  });

  test("listr CommentStatus", () => {
    expect(CommentStatus.listr()).toStrictEqual(["resolved", "unresolved", "public", "reason"]);
  });
});
