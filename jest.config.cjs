/** @type {import('jest').Config} */
const config = {
  detectOpenHandles: true,
  collectCoverage: true,
  collectCoverageFrom: ["app/**"],
  coverageThreshold: {
    global: {
      statements: 27.87,
      branches: 38.72,
      functions: 19.7,
      lines: 27.69,
    },
  },
};

module.exports = config;
