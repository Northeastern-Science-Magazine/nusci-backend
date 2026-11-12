import crypto from "crypto";
import OTPToken from "../../../../app/auth/opt.js";

describe("OTPToken.generate", () => {
  test("returns a 32-byte hex token and its sha256 hash", () => {
    const { token, hash } = OTPToken.generate();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).toBe(crypto.createHash("sha256").update(token).digest("hex"));
  });

  test("two generated tokens differ", () => {
    const first = OTPToken.generate();
    const second = OTPToken.generate();
    expect(first.token).not.toBe(second.token);
    expect(first.hash).not.toBe(second.hash);
  });
});

describe("OTPToken.hash", () => {
  test("is the sha256 hex digest of the token", () => {
    expect(OTPToken.hash("valid-invite-token")).toBe(crypto.createHash("sha256").update("valid-invite-token").digest("hex"));
  });

  test("is deterministic and input-sensitive", () => {
    expect(OTPToken.hash("abc")).toBe(OTPToken.hash("abc"));
    expect(OTPToken.hash("abc")).not.toBe(OTPToken.hash("abd"));
  });
});

describe("OTPToken.compare", () => {
  test("true when the trial token hashes to the stored hash", () => {
    const { token, hash } = OTPToken.generate();
    expect(OTPToken.compare(token, hash)).toBe(true);
  });

  test("false for a different token", () => {
    const { hash } = OTPToken.generate();
    const other = OTPToken.generate();
    expect(OTPToken.compare(other.token, hash)).toBe(false);
  });

  test("false when the stored hash has a different length", () => {
    const { token } = OTPToken.generate();
    expect(OTPToken.compare(token, "abcd")).toBe(false);
    expect(OTPToken.compare(token, "")).toBe(false);
  });
});
