import { log } from "../../../testConfig.js";
import Accounts from "../../../../app/models/enums/accounts.js";
import { ErrorValidation } from "../../../../app/error/errors.js";


describe("Tests for enumerated type Accounts", () => {
  test("toString Admin", () => {
    expect(Accounts.Admin.toString()).toStrictEqual("admin");
  });

  test("toString Author", () => {
    expect(Accounts.Author.toString()).toStrictEqual("author");
  });

  test("toString Designer", () => {
    expect(Accounts.Designer.toString()).toStrictEqual("designer");
  });

  test("toString Developer", () => {
    expect(Accounts.Developer.toString()).toStrictEqual("developer");
  });

  test("toString Editor", () => {
    expect(Accounts.Editor.toString()).toStrictEqual("editor");
  });

  test("toString None", () => {
    expect(Accounts.None.toString()).toStrictEqual("none");
  });

  test("toString Photographer", () => {
    expect(Accounts.Photographer.toString()).toStrictEqual("photographer");
  });

  test("toAccount Admin", () => {
    expect(Accounts.toAccount("admin")).toStrictEqual(Accounts.Admin);
  });

  test("toAccount Author", () => {
    expect(Accounts.toAccount("author")).toStrictEqual(Accounts.Author);
  });

  test("toAccount Designer", () => {
    expect(Accounts.toAccount("designer")).toStrictEqual(Accounts.Designer);
  });

  test("toAccount Developer", () => {
    expect(Accounts.toAccount("developer")).toStrictEqual(Accounts.Developer);
  });

  test("toAccount Editor", () => {
    expect(Accounts.toAccount("editor")).toStrictEqual(Accounts.Editor);
  });

  test("toAccount None", () => {
    expect(Accounts.toAccount("none")).toStrictEqual(Accounts.None);
  });

  test("toAccount Photographer", () => {
    expect(Accounts.toAccount("photographer")).toStrictEqual(Accounts.Photographer);
  });

  test("toAccount invalid input", () => {
    expect(() => {
      Accounts.toAccount("invalid");
    }).toThrow(ErrorValidation);
  });

  test("list Account", () => {
    expect(Accounts.list()).toStrictEqual([
      Accounts.None,
      Accounts.Author,
      Accounts.Editor,
      Accounts.Photographer,
      Accounts.Developer,
      Accounts.Designer,
      Accounts.Admin,
    ]);
  });

  test("listr Account", () => {
    expect(Accounts.listr()).toStrictEqual(["none", "author", "editor", "photographer", "developer", "designer", "admin"]);
  });
});
