/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 42.52,
      branches: 66.82,
      functions: 42.15,
      lines: 41.89,
    },
  },
};

module.exports = config;
