export default {
    testEnvironment: 'node',
    transform: {},
    extensionsToTreatAsEsm: ['.js'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    testMatch: ['**/tests/**/*.js', '**/?(*.)+(spec|test).js'],
    verbose: true
  };