import type { Config } from 'jest';

const jestConfig: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  preset: 'ts-jest',
  
};

export default jestConfig;
