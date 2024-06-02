import type { Config } from 'jest';

const jestConfig: Config = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 30,
      functions: 30,
      lines: 30,
    },
  },
};

export default jestConfig;
