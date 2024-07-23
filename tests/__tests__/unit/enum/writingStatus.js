import { log } from "../../../testConfig.js";
import WritingStatus from "../../../../app/models/enums/writingStatus.js";
import { ErrorInternalEnumValidation } from "../../../../app/error/internalErrors.js";

const showLog =
  log[__filename.split("/")[__filename.split("/").length - 3]][__filename.split("/")[__filename.split("/").length - 2]][
    __filename.split("/")[__filename.split("/").length - 1].slice(0, -3)
  ];

describe("Tests for enumerated type WritingStatus", () => {
  test("toString Needs_Editor", () => {
    expect(WritingStatus.Needs_Editor.toString()).toStrictEqual("needs_editor");
  });

  test("toString Has_Editor", () => {
    expect(WritingStatus.Has_Editor.toString()).toStrictEqual("has_editor");
  });

  test("toString Rough_Draft_Complete", () => {
    expect(WritingStatus.Rough_Draft_Complete.toString()).toStrictEqual("rough_draft_complete");
  });

  test("toString Edits_Complete", () => {
    expect(WritingStatus.Edits_Complete.toString()).toStrictEqual("edits_complete");
  });

  test("toString Copy_Edits_Complete", () => {
    expect(WritingStatus.Copy_Edits_Complete.toString()).toStrictEqual("copy_edits_complete");
  });

  test("toString EIC_Approved", () => {
    expect(WritingStatus.EIC_Approved.toString()).toStrictEqual("eic_approved");
  });

  test("toString Dropped", () => {
    expect(WritingStatus.Dropped.toString()).toStrictEqual("dropped");
  });

  test("toWritingStatus Needs_Editor", () => {
    expect(WritingStatus.toWritingStatus("needs_editor")).toStrictEqual(WritingStatus.Needs_Editor);
  });

  test("toWritingStatus Has_Editor", () => {
    expect(WritingStatus.toWritingStatus("has_editor")).toStrictEqual(WritingStatus.Has_Editor);
  });

  test("toWritingStatus Rough_Draft_Complete", () => {
    expect(WritingStatus.toWritingStatus("rough_draft_complete")).toStrictEqual(WritingStatus.Rough_Draft_Complete);
  });

  test("toWritingStatus Edits_Complete", () => {
    expect(WritingStatus.toWritingStatus("edits_complete")).toStrictEqual(WritingStatus.Edits_Complete);
  });

  test("toWritingStatus Copy_Edits_Complete", () => {
    expect(WritingStatus.toWritingStatus("copy_edits_complete")).toStrictEqual(WritingStatus.Copy_Edits_Complete);
  });

  test("toWritingStatus EIC_Approved", () => {
    expect(WritingStatus.toWritingStatus("eic_approved")).toStrictEqual(WritingStatus.EIC_Approved);
  });

  test("toWritingStatus Dropped", () => {
    expect(WritingStatus.toWritingStatus("dropped")).toStrictEqual(WritingStatus.Dropped);
  });

  test("toWritingStatus invalid input", () => {
    expect(() => {
      WritingStatus.toWritingStatus("invalid");
    }).toThrow(ErrorInternalEnumValidation);
  });

  test("list WritingStatus", () => {
    expect(WritingStatus.list()).toStrictEqual([
      WritingStatus.Needs_Editor,
      WritingStatus.Has_Editor,
      WritingStatus.Rough_Draft_Complete,
      WritingStatus.Edits_Complete,
      WritingStatus.Copy_Edits_Complete,
      WritingStatus.EIC_Approved,
      WritingStatus.Dropped,
    ]);
  });

  test("listr WritingStatus", () => {
    expect(WritingStatus.listr()).toStrictEqual([
      "needs_editor",
      "has_editor",
      "rough_draft_complete",
      "edits_complete",
      "copy_edits_complete",
      "eic_approved",
      "dropped",
    ]);
  });
});
