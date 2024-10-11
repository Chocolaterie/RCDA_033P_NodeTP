module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
    
    collectCoverageFrom: [
      "src/**/*-service.js",
    ]
  };