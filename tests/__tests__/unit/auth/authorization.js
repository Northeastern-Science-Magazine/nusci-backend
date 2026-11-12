import jwt from "jsonwebtoken";
import Authorize from "../../../../app/auth/authorization.js";
import Accounts from "../../../../app/models/enums/accounts.js";
import { ErrorNotLoggedIn } from "../../../../app/error/errors.js";

process.env.SERVER_TOKEN_KEY = "test-server-token-key";

const sign = (payload) => jwt.sign(payload, process.env.SERVER_TOKEN_KEY);
const reqWith = (token) => ({ cookies: token === undefined ? {} : { token } });
const mockRes = () => {
  const res = { clearCookie: jest.fn(), json: jest.fn() };
  res.status = jest.fn(() => res);
  return res;
};

describe("Authorize.verifyToken", () => {
  test("returns the payload of a valid token", () => {
    const token = sign({ email: "ethan@ethan.com", roles: ["admin"] });
    const payload = Authorize.verifyToken(reqWith(token));
    expect(payload.email).toBe("ethan@ethan.com");
    expect(payload.roles).toEqual(["admin"]);
  });

  test("throws ErrorNotLoggedIn when there is no token cookie", () => {
    expect(() => Authorize.verifyToken(reqWith(undefined))).toThrow(ErrorNotLoggedIn);
  });

  test("throws ErrorNotLoggedIn for a token signed with another key", () => {
    const token = jwt.sign({ email: "a@b.com", roles: [] }, "some-other-key");
    expect(() => Authorize.verifyToken(reqWith(token))).toThrow(ErrorNotLoggedIn);
  });

  test("throws ErrorNotLoggedIn for a malformed token", () => {
    expect(() => Authorize.verifyToken(reqWith("not-a-jwt"))).toThrow(ErrorNotLoggedIn);
  });
});

describe("Authorize.isLoggedIn", () => {
  test("true for a valid token", () => {
    const token = sign({ email: "ethan@ethan.com", roles: ["admin"] });
    expect(Authorize.isLoggedIn(reqWith(token))).toBe(true);
  });

  test("false with no token and false with a bad token", () => {
    expect(Authorize.isLoggedIn(reqWith(undefined))).toBe(false);
    expect(Authorize.isLoggedIn(reqWith("not-a-jwt"))).toBe(false);
  });
});

describe("Authorize.getEmail", () => {
  test("returns the email from the token payload", () => {
    const token = sign({ email: "raisa@raisa.com", roles: ["editor"] });
    expect(Authorize.getEmail(reqWith(token))).toBe("raisa@raisa.com");
  });

  test("throws ErrorNotLoggedIn with no token", () => {
    expect(() => Authorize.getEmail(reqWith(undefined))).toThrow(ErrorNotLoggedIn);
  });
});

describe("Authorize.getRoles", () => {
  test("returns the roles from the token payload", () => {
    const token = sign({ email: "a@b.com", roles: ["author", "editor"] });
    expect(Authorize.getRoles(reqWith(token))).toEqual(["author", "editor"]);
  });

  test("throws ErrorNotLoggedIn with no token cookie", () => {
    expect(() => Authorize.getRoles(reqWith(undefined))).toThrow(ErrorNotLoggedIn);
  });

  test("throws for a token signed with another key", () => {
    const token = jwt.sign({ email: "a@b.com", roles: ["admin"] }, "some-other-key");
    expect(() => Authorize.getRoles(reqWith(token))).toThrow();
  });
});

describe("Authorize.allow", () => {
  test("calls next when the user has one of the allowed roles", () => {
    const token = sign({ email: "ethan@ethan.com", roles: ["admin"] });
    const res = mockRes();
    const next = jest.fn();
    Authorize.allow([Accounts.Admin])(reqWith(token), res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("matches any of several token roles against any of several allowed roles", () => {
    const token = sign({ email: "a@b.com", roles: ["author", "editor"] });
    const next = jest.fn();
    Authorize.allow([Accounts.Editor, Accounts.Admin])(reqWith(token), mockRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("responds 403 without calling next when the user lacks the role", () => {
    const token = sign({ email: "a@b.com", roles: ["author"] });
    const res = mockRes();
    const next = jest.fn();
    Authorize.allow([Accounts.Admin])(reqWith(token), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Insufficient permissions to access this resource." })
    );
  });

  test("clears the token cookie and responds 403 when there is no token", () => {
    const res = mockRes();
    const next = jest.fn();
    Authorize.allow([Accounts.Admin])(reqWith(undefined), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith("token");
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Please log in to access this resource." }));
  });

  test("clears the token cookie and responds 403 for an invalid token", () => {
    const res = mockRes();
    const next = jest.fn();
    Authorize.allow([Accounts.Admin])(reqWith("not-a-jwt"), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith("token");
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
