/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 69.2,
      branches: 73.6,
      lines: 68.33,
      functions: 62.71,
    },
  },
  moduleNameMapper: {
    "^../db/connection.js$": "<rootDir>/tests/util/mockConnection.js",
  },
  rootDir: "./",
};

module.exports = config;
