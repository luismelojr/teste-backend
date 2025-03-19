import paths from './mapperPaths.json';

module.exports = {
  testTimeout: 10000,
  verbose: false,
  maxWorkers: 1,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\integration.test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: paths,
  testEnvironment: 'node',
  coverageDirectory: '../coverage',
};
