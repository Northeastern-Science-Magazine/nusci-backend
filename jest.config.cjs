/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 58.72,
      branches: 69.23,
      lines: 57.38,
      functions: 50.49,
    },
  },
};

module.exports = config;
