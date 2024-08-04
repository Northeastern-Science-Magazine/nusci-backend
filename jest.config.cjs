/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 48.99,
      branches: 74.24,
      functions: 50.45,
      lines: 48.14,
    },
  },
};

module.exports = config;
