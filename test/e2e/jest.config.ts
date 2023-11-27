import { type Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  testRegex: '.*\\.e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  collectCoverageFrom: [
    '**/*.(t|j)s'
  ],
  rootDir: '../../',
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@infra/(.*)': '<rootDir>/src/infra/$1',
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@test/(.*)': '<rootDir>/test/$1'
  },
  logHeapUsage: true,
  detectOpenHandles: true,
  testTimeout: 120000
}

export default config
