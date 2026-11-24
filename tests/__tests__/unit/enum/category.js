import { log } from "../../../testConfig.js";
import Category from "../../../../app/models/enums/categories.js";
import { ErrorValidation } from "../../../../app/error/errors.js";

const categories = [
  ["Biology", "Biology"],
  ["Chemistry", "Chemistry"],
  ["Culture", "Culture"],
  ["Environment", "Environment"],
  ["Health", "Health"],
  ["Local", "Local"],
  ["Mathematics", "Mathematics"],
  ["Neuroscience", "Neuroscience"],
  ["Newsletter", "Newsletter"],
  ["Opinion", "Opinion"],
  ["Philosophy", "Philosophy"],
  ["Physics", "Physics"],
  ["Politics", "Politics"],
  ["Psychology", "Psychology"],
  ["Space", "Space"],
  ["Technology", "Technology"],
  ["Uncategorized", "Uncategorized"],
  ["World", "World"],
  ["Interview", "Interview"],
];

describe("Tests for enumerated type Category", () => {
  test.each(categories)("toString %s", (key, str) => {
    expect(Category[key].toString()).toStrictEqual(str);
  });

  test.each(categories)("toCategory %s", (key, str) => {
    expect(Category.toCategory(str)).toStrictEqual(Category[key]);
  });

  test("toCategory is case insensitive", () => {
    expect(Category.toCategory("biology")).toStrictEqual(Category.Biology);
    expect(Category.toCategory("BIOLOGY")).toStrictEqual(Category.Biology);
  });

  test("toCategory invalid input", () => {
    expect(() => {
      Category.toCategory("invalid");
    }).toThrow(ErrorValidation);
  });

  test("list Category", () => {
    expect(Category.list()).toStrictEqual(categories.map(([key]) => Category[key]));
  });

  test("listr Category", () => {
    expect(Category.listr()).toStrictEqual(categories.map(([, str]) => str));
  });
});
