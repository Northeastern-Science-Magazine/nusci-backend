/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 59.09,
      branches: 69.23,
      lines: 57.77,
      functions: 50.49,
    },
  },
};

module.exports = config;
