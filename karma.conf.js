module.exports = function (config) {
  config.set({
    basePath: '',
    singleRun: false,
    autoWatch: true,
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      { pattern: 'src/**/*.js', type: 'module', included: false },
      { pattern: 'test/testutils.js', type: 'module', included: false },
      { pattern: 'test/**/*.spec.js', type: 'module' },
    ],
    browsers: ['ChromeHeadless'],
    reporters: ['mocha'],
    client: {
      mocha: {
        timeout: 4000,
        reporter: 'html'
      }
    }
  });
};
