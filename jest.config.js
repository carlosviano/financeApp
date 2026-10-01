module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/tests/**/*.test.{ts,tsx}'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  // React Native loads most modules lazily, so the first render in a file pays
  // for compiling them. On a cold cache (CI) that alone can pass Jest's 5 s default.
  testTimeout: 15000,
};
