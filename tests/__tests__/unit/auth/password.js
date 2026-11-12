import Password from "../../../../app/auth/password.js";

describe("Password.hash", () => {
  test("returns a bcrypt hash, not the plaintext", async () => {
    const hashed = await Password.hash("hunter2", 10);
    expect(typeof hashed).toBe("string");
    expect(hashed).not.toBe("hunter2");
    expect(hashed).toMatch(/^\$2[aby]\$10\$/);
  });

  test("salts: two hashes of the same password differ", async () => {
    const first = await Password.hash("same-password", 10);
    const second = await Password.hash("same-password", 10);
    expect(first).not.toBe(second);
  });

  test("respects the requested salt rounds", async () => {
    const hashed = await Password.hash("hunter2", 12);
    expect(hashed).toMatch(/^\$2[aby]\$12\$/);
  });
});

describe("Password.compare", () => {
  test("true for the password that produced the hash", async () => {
    const hashed = await Password.hash("correct horse", 10);
    await expect(Password.compare("correct horse", hashed)).resolves.toBe(true);
  });

  test("false for a different password", async () => {
    const hashed = await Password.hash("correct horse", 10);
    await expect(Password.compare("wrong horse", hashed)).resolves.toBe(false);
  });

  test("false for an empty trial password", async () => {
    const hashed = await Password.hash("correct horse", 10);
    await expect(Password.compare("", hashed)).resolves.toBe(false);
  });

  test("false against a hash of a different password", async () => {
    const hashed = await Password.hash("someone elses password", 10);
    await expect(Password.compare("correct horse", hashed)).resolves.toBe(false);
  });
});
