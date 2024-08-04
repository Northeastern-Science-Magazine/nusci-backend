import { log } from "../../../testConfig.js";
import DesignStatus from "../../../../app/models/enums/designStatus.js";
import { ErrorInternalEnumValidation } from "../../../../app/error/internalErrors.js";

const showLog =
  log[__filename.split("/")[__filename.split("/").length - 3]][__filename.split("/")[__filename.split("/").length - 2]][
    __filename.split("/")[__filename.split("/").length - 1].slice(0, -3)
  ];

describe("Tests for enumerated type DesignStatus", () => {
  test("toString Needs_Designer", () => {
    expect(DesignStatus.Needs_Designer.toString()).toStrictEqual("needs_designer");
  });

  test("toString Has_Designer", () => {
    expect(DesignStatus.Has_Designer.toString()).toStrictEqual("has_designer");
  });

  test("toString In_Progress", () => {
    expect(DesignStatus.In_Progress.toString()).toStrictEqual("in_progress");
  });

  test("toString Completed", () => {
    expect(DesignStatus.Completed.toString()).toStrictEqual("completed");
  });

  test("toDesignStatus Needs_Designer", () => {
    expect(DesignStatus.toDesignStatus("needs_designer")).toStrictEqual(DesignStatus.Needs_Designer);
  });

  test("toDesignStatus Has_Designer", () => {
    expect(DesignStatus.toDesignStatus("has_designer")).toStrictEqual(DesignStatus.Has_Designer);
  });

  test("toDesignStatus In_Progress", () => {
    expect(DesignStatus.toDesignStatus("in_progress")).toStrictEqual(DesignStatus.In_Progress);
  });

  test("toDesignStatus Completed", () => {
    expect(DesignStatus.toDesignStatus("completed")).toStrictEqual(DesignStatus.Completed);
  });

  test("toDesignStatus invalid input", () => {
    expect(() => {
      DesignStatus.toDesignStatus("invalid");
    }).toThrow(ErrorInternalEnumValidation);
  });

  test("list DesignStatus", () => {
    expect(DesignStatus.list()).toStrictEqual([
      DesignStatus.Needs_Designer,
      DesignStatus.Has_Designer,
      DesignStatus.In_Progress,
      DesignStatus.Completed,
    ]);
  });

  test("listr DesignStatus", () => {
    expect(DesignStatus.listr()).toStrictEqual(["needs_designer", "has_designer", "in_progress", "completed"]);
  });
});
