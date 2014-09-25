// Karma configuration
// Generated on Sun Apr 27 2014 21:09:13 GMT+0100 (BST)

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'dist/*',
            'test/*.js',
            'test/fixture/*.html'
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/fixture/*.html': ['html2js']
        },
        reporters: [
            'progress',
            'coverage',
            'coveralls'
        ],
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },
        //port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false
    });
};
