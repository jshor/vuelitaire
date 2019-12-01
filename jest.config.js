module.exports = {
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/renderer/.*/__spec__/.*'
  ],
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'vue'
  ],
  setupFiles: ['<rootDir>/test/setup.js'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/renderer/$1'
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '<rootDir>/src/renderer/**/*.spec.(js|ts)|**/__tests__/*.(js|ts)'
  ],
  testURL: 'http://localhost/'
}
