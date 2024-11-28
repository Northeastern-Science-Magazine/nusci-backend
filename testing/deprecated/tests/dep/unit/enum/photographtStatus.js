import { log } from "../../../testConfig.js";
import PhotographyStatus from "../../../../app/models/enums/photographyStatus.js";
import { ErrorValidation } from "../../../../app/error/errors.js";


describe("Tests for enumerated type PhotographyStatus", () => {
  test("toString No_Photo", () => {
    expect(PhotographyStatus.No_Photo.toString()).toStrictEqual("no_photo");
  });

  test("toString Needs_Photographer", () => {
    expect(PhotographyStatus.Needs_Photographer.toString()).toStrictEqual("needs_photographer");
  });

  test("toString Photographer_Assigned", () => {
    expect(PhotographyStatus.Photographer_Assigned.toString()).toStrictEqual("photographer_assigned");
  });

  test("toString Photo_Complete", () => {
    expect(PhotographyStatus.Photo_Complete.toString()).toStrictEqual("photo_complete");
  });

  test("toPhotographyStatus No_Photo", () => {
    expect(PhotographyStatus.toPhotographyStatus("no_photo")).toStrictEqual(PhotographyStatus.No_Photo);
  });

  test("toPhotographyStatus Needs_Photographer", () => {
    expect(PhotographyStatus.toPhotographyStatus("needs_photographer")).toStrictEqual(PhotographyStatus.Needs_Photographer);
  });

  test("toPhotographyStatus Photographer_Assigned", () => {
    expect(PhotographyStatus.toPhotographyStatus("photographer_assigned")).toStrictEqual(
      PhotographyStatus.Photographer_Assigned
    );
  });

  test("toPhotographyStatus Photo_Complete", () => {
    expect(PhotographyStatus.toPhotographyStatus("photo_complete")).toStrictEqual(PhotographyStatus.Photo_Complete);
  });

  test("toPhotographyStatus invalid input", () => {
    expect(() => {
      PhotographyStatus.toPhotographyStatus("invalid");
    }).toThrow(ErrorValidation);
  });

  test("list PhotographyStatus", () => {
    expect(PhotographyStatus.list()).toStrictEqual([
      PhotographyStatus.No_Photo,
      PhotographyStatus.Needs_Photographer,
      PhotographyStatus.Photographer_Assigned,
      PhotographyStatus.Photo_Complete,
    ]);
  });

  test("listr PhotographyStatus", () => {
    expect(PhotographyStatus.listr()).toStrictEqual([
      "no_photo",
      "needs_photographer",
      "photographer_assigned",
      "photo_complete",
    ]);
  });
});
