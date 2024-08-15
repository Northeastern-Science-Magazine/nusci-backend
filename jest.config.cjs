/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 45.49,
      branches: 49,
      functions: 49.09,
      lines: 44.72,
    },
  },
};

module.exports = config;
