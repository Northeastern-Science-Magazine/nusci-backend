import jwt from "jsonwebtoken";
import LoginToken from "../../../../app/auth/token.js";

process.env.SERVER_TOKEN_KEY = "test-server-token-key";

describe("LoginToken.generate", () => {
  const user = { email: "ethan@ethan.com", roles: ["admin"] };

  test("returns the cookie name, a signed token, and the cookie options", () => {
    const [name, token, options] = LoginToken.generate(user);
    expect(name).toBe("token");
    expect(typeof token).toBe("string");
    expect(options).toEqual({ httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000 });
  });

  test("the token verifies with the server key and carries email and roles", () => {
    const [, token] = LoginToken.generate(user);
    const payload = jwt.verify(token, process.env.SERVER_TOKEN_KEY);
    expect(payload.email).toBe("ethan@ethan.com");
    expect(payload.roles).toEqual(["admin"]);
  });

  test("the token does not verify with a different key", () => {
    const [, token] = LoginToken.generate(user);
    expect(() => jwt.verify(token, "some-other-key")).toThrow();
  });

  test("encodes whatever roles the user has", () => {
    const [, token] = LoginToken.generate({ email: "a@b.com", roles: ["author", "editor"] });
    const payload = jwt.verify(token, process.env.SERVER_TOKEN_KEY);
    expect(payload.email).toBe("a@b.com");
    expect(payload.roles).toEqual(["author", "editor"]);
  });
});
