import MockConnection from "./mockConnection";
import { execSync } from "child_process";

/**
 * Executes the command `npm run reset-s` with no
 * terminal output at this project directory level.
 */
export const executeReset = async () => {
  execSync("npm run reset-s", { stdio: "ignore" });
};

/**
 * This provides the mock that allows test runs in
 * the application to utilize the MockConnection class
 * rather than the Connection class.
 *
 * This function should be called before each test,
 * to overwrite the Connection.open() and
 * Connection.close() methods as the tests run, with
 * the MockConnection methods.
 *
 * The application maintains no awareness of the
 * MockConnection, since this "injection" only
 * happens during test runs.
 */
export const injectMockConnection = () => {
  jest.mock("../db/connection.js", () => {
    return {
      default: jest.fn().mockImplementation(() => ({
        open: jest.fn(() => MockConnection.open(true)),
        close: jest.fn(() => MockConnection.close(true)),
      })),
    };
  });
};

/**
 * Callback function that closes the mock connection.
 */
export const closeMockConnection = async () => {
  await MockConnection.close(true);
};
