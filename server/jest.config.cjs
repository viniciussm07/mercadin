/** @type {import("jest").Config} */
module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.e2e-spec.ts",
    "!src/main.ts",
  ],
  coverageThreshold: {
    global: {
      lines: 60,
      statements: 60,
    },
  },
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "^\\.\\./services/supabase-jwt\\.service$": "<rootDir>/test/mocks/supabase-jwt.service.ts",
    "^@/modules/auth/services/supabase-jwt.service$":
      "<rootDir>/test/mocks/supabase-jwt.service.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/modules/**/*.spec.ts", "<rootDir>/src/modules/**/*.e2e-spec.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
  },
};
