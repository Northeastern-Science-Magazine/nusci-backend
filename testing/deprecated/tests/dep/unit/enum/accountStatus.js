import { log } from "../../../testConfig.js";
import AccountStatus from "../../../../app/models/enums/accountStatus.js";
import { ErrorValidation } from "../../../../app/error/errors.js";


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
    }).toThrow(ErrorValidation);
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
