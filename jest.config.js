module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '(/test/.*|\\.(test|spec))\\.(js|ts|tsx)$',
    // 或者指定 testPathIgnorePatterns
    testPathIgnorePatterns: [
      '/node_modules/', // 忽略 node_modules 目录
    ],
    reporters: [
      'default',
      ['jest-html-reporters', {
        publicPath: './reports',
        filename: 'report.html',
        expand: true,
      }]
    ],
    collectCoverage: true, // 启用覆盖率收集
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}', // 收集 src 目录下所有 TypeScript 文件的覆盖率
      '!src/**/*.d.ts', // 排除 TypeScript 类型声明文件
    ],
    coverageDirectory: 'coverage', // 指定覆盖率报告的输出目录
    coverageReporters: ['json', 'html', 'text'], // 指定覆盖率报告格式
  };