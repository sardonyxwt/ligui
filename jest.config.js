module.exports = {
    testURL: 'http://localhost',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testRegex: '/test/.*\\.test\\.ts$',
    reporters: [
        'default',
        ['./node_modules/jest-html-reporter', {
            pageTitle: 'Ligui Test Report',
            outputPath: './report/test-report.html',
            includeFailureMsg: true,
            includeConsoleLog: true
        }]
    ],
    collectCoverage: true,
    coverageDirectory: './report/coverage',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!<rootDir>/node_modules/'
    ]
};
