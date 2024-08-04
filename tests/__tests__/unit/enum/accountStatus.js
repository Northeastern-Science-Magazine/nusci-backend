import { log } from "../../../testConfig.js";
import AccountStatus from "../../../../app/models/enums/accountStatus.js";
import { ErrorInternalEnumValidation } from "../../../../app/error/internalErrors.js";

const showLog =
  log[__filename.split("/")[__filename.split("/").length - 3]][__filename.split("/")[__filename.split("/").length - 2]][
    __filename.split("/")[__filename.split("/").length - 1].slice(0, -3)
  ];

describe("Tests for enumerated type AccountStatus", () => {
  test("toString Pending", () => {
    expect(AccountStatus.Pending.toString()).toStrictEqual("pending");
  });

  test("toString Deactivated", () => {
    expect(AccountStatus.Deactivated.toString()).toStrictEqual("deactivated");
  });

  test("toString Approved", () => {
    expect(AccountStatus.Approved.toString()).toStrictEqual("approved");
  });

  test("toString Denied", () => {
    expect(AccountStatus.Denied.toString()).toStrictEqual("denied");
  });

  test("toAccountStatus Pending", () => {
    expect(AccountStatus.toAccountStatus("pending")).toStrictEqual(AccountStatus.Pending);
  });

  test("toAccountStatus Deactivated", () => {
    expect(AccountStatus.toAccountStatus("deactivated")).toStrictEqual(AccountStatus.Deactivated);
  });

  test("toAccountStatus Approved", () => {
    expect(AccountStatus.toAccountStatus("approved")).toStrictEqual(AccountStatus.Approved);
  });

  test("toAccountStatus Denied", () => {
    expect(AccountStatus.toAccountStatus("denied")).toStrictEqual(AccountStatus.Denied);
  });

  test("toAccountStatus invalid input", () => {
    expect(() => {
      AccountStatus.toAccountStatus("invalid");
    }).toThrow(ErrorInternalEnumValidation);
  });

  test("list AccountStatus", () => {
    expect(AccountStatus.list()).toStrictEqual([
      AccountStatus.Pending,
      AccountStatus.Deactivated,
      AccountStatus.Approved,
      AccountStatus.Denied,
    ]);
  });

  test("listr AccountStatus", () => {
    expect(AccountStatus.listr()).toStrictEqual(["pending", "deactivated", "approved", "denied"]);
  });
});
