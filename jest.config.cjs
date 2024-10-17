/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 59.23,
      branches: 70.32,
      lines: 57.91,
      functions: 50.49,
    },
  },
};

module.exports = config;
