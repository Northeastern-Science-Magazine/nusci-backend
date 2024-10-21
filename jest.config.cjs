/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 60.34,
      branches: 75.11,
      lines: 59.56,
      functions: 50.49,
    },
  },
};

module.exports = config;
