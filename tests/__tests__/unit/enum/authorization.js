/// <reference types="jest" />

import Authorize from "../../../../app/auth/authorization.js";
import jwt from "jsonwebtoken";
import Accounts from "../../../../app/models/enums/accounts.js";
import { ErrorFailedLogin, ErrorForbidden, ErrorNotLoggedIn } from "../../../../app/error/errors.js";

jest.mock("jsonwebtoken");
jest.mock("../../../../app/error/errors.js");
jest.mock("../../../../app/models/enums/accounts.js");

describe("Authorize.getEmail() tests", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { cookies: {} };
    mockRes = {};
    process.env.SERVER_TOKEN_KEY = "test-secret-key";
  });

  test("returns email when token is valid", () => {
    mockReq.cookies.token = "valid-token-123";
    jwt.verify.mockReturnValue({
      email: "test@northeastern.edu",
      roles: ["admin"],
    });

    const result = Authorize.getEmail(mockReq, mockRes);

    expect(result).toBe("test@northeastern.edu");
    expect(jwt.verify).toHaveBeenCalledWith("valid-token-123", "test-secret-key");
  });

  test("throws ErrorNotLoggedIn when no token exists", () => {
    const mockErrorInstance = { throwHttp: jest.fn() };
    ErrorNotLoggedIn.mockImplementation(() => mockErrorInstance);

    Authorize.getEmail(mockReq, mockRes);

    expect(ErrorNotLoggedIn).toHaveBeenCalled();
    expect(mockErrorInstance.throwHttp).toHaveBeenCalledWith(mockReq, mockRes);
  });

  test("throws ErrorFailedLogin when token is invalid", () => {
    mockReq.cookies.token = "invalid-token";
    jwt.verify.mockReturnValue(null);
    const mockErrorInstance = { throwHttp: jest.fn() };
    ErrorFailedLogin.mockImplementation(() => mockErrorInstance);

    Authorize.getEmail(mockReq, mockRes);

    expect(ErrorFailedLogin).toHaveBeenCalled();
    expect(mockErrorInstance.throwHttp).toHaveBeenCalledWith(mockReq, mockRes);
  });
});

describe("Authorize.getRoles() tests", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { cookies: {} };
    mockRes = {};
    process.env.SERVER_TOKEN_KEY = "test-secret-key";
  });

  test("returns roles when token is valid", () => {
    mockReq.cookies.token = "valid-token-123";
    jwt.verify.mockReturnValue({
      email: "test@northeastern.edu",
      roles: ["admin", "editor"],
    });

    const result = Authorize.getRoles(mockReq, mockRes);

    expect(result).toEqual(["admin", "editor"]);
    expect(jwt.verify).toHaveBeenCalledWith("valid-token-123", "test-secret-key");
  });

  test("throws ErrorNotLoggedIn when no token exists", () => {
    const mockErrorInstance = { throwHttp: jest.fn() };
    ErrorNotLoggedIn.mockImplementation(() => mockErrorInstance);

    Authorize.getRoles(mockReq, mockRes);

    expect(ErrorNotLoggedIn).toHaveBeenCalled();
    expect(mockErrorInstance.throwHttp).toHaveBeenCalledWith(mockReq, mockRes);
  });

  test("throws ErrorFailedLogin when token is invalid", () => {
    mockReq.cookies.token = "invalid-token";
    jwt.verify.mockReturnValue(null);
    const mockErrorInstance = { throwHttp: jest.fn() };
    ErrorFailedLogin.mockImplementation(() => mockErrorInstance);

    Authorize.getRoles(mockReq, mockRes);

    expect(ErrorFailedLogin).toHaveBeenCalled();
    expect(mockErrorInstance.throwHttp).toHaveBeenCalledWith(mockReq, mockRes);
  });
});

describe("Authorize.allow() tests", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = { cookies: {} };
    mockRes = {};
    mockNext = jest.fn();
    process.env.SERVER_TOKEN_KEY = "test-secret-key";
  });

  test("calls next() when user has required role", () => {
    mockReq.cookies.token = "valid-token";
    jwt.verify.mockReturnValue({
      email: "test@northeastern.edu",
      roles: ["admin", "editor"],
    });
    Accounts.toAccount.mockImplementation((role) => role);

    const middleware = Authorize.allow(["admin"]);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret-key");
  });

  test("throws ErrorForbidden when user lacks required role", () => {
    mockReq.cookies.token = "valid-token";
    jwt.verify.mockReturnValue({
      email: "test@northeastern.edu",
      roles: ["editor"],
    });
    Accounts.toAccount.mockImplementation((role) => role);

    const mockErrorInstance = { throwHttp: jest.fn() };
    ErrorForbidden.mockImplementation(() => mockErrorInstance);

    const middleware = Authorize.allow(["admin"]);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(ErrorForbidden).toHaveBeenCalled();
    expect(mockErrorInstance.throwHttp).toHaveBeenCalledWith(mockReq, mockRes);
  });

  test("throws ErrorForbidden when payload is null", () => {
    mockReq.cookies.token = "valid-token";
    jwt.verify.mockReturnValue(null);

    const mockErrorInstance = { throwHttp: jest.fn() };
    ErrorForbidden.mockImplementation(() => mockErrorInstance);

    const middleware = Authorize.allow(["admin"]);
    middleware(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(ErrorForbidden).toHaveBeenCalled();
    expect(mockErrorInstance.throwHttp).toHaveBeenCalledWith(mockReq, mockRes);
  });

  test("throws ErrorNotLoggedIn when token is missing", () => {
    const mockErrorInstance = { throwHttp: jest.fn() };
    ErrorNotLoggedIn.mockImplementation(() => mockErrorInstance);

    const middleware = Authorize.allow(["admin"]);
    middleware(mockReq, mockRes, mockNext);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(ErrorNotLoggedIn).toHaveBeenCalled();
    expect(mockErrorInstance.throwHttp).toHaveBeenCalledWith(mockReq, mockRes);
  });
});
