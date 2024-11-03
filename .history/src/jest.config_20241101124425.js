module.exports = {
  preset: 'ts-jest', // Use ts-jest preset
  testEnvironment: 'node', // Set the test environment to Node.js
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Specify the module file extensions
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files
  },
  testMatch: ['**/tests/**/*.spec.ts'], // Specify the location of your test files
  collectCoverage: true, // Collect coverage information
  coverageDirectory: 'coverage', // Directory to output coverage information
  // Optionally, specify other settings like moduleNameMapper, etc.
};
