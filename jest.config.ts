import type { Config } from 'jest';

const jestConfig: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};

export default jestConfig;
