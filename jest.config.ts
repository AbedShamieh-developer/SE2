import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest', //test for ts
    testEnvironment: 'node', //test for node
    roots: ['<rootDir>/test'], //test for test folder
    testMatch: ['**/*.test.ts', '**/*.tests.ts'], //test for .test.ts and .tests.ts files
    verbose: true, //test for verbose too many outputs
    collectCoverage: true, //test for collect coverage
    collectCoverageFrom: ['src/**/*.ts'], //test for collect coverage from src folder
    coverageDirectory: 'coverage', //test for coverage directory
}
export default config;
