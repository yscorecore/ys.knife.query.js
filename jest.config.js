module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/test/.*|\\.(test|spec))\\.(js|ts|tsx)$',
    // 或者指定 testPathIgnorePatterns
    testPathIgnorePatterns: [
      '/node_modules/', // 忽略 node_modules 目录
    ],
  };