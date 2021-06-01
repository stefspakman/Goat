/**
 * Execute webpack config
 * @param {Object} config
 */
function buildStory(config) {
  const goatGonfig = require('../config.js');
  goatGonfig.config = config;
  const server = require('@storybook/core/server');
  function interopRequireDefault(obj) {
    // eslint-disable-next-line no-underscore-dangle
    return obj && obj.__esModule ? obj : { default: obj };
  }

  const options = interopRequireDefault(require('@storybook/html/dist/server/options'));

  server.buildStaticStandalone({
    ...options.default,
    configDir: __dirname,
    outputDir: config.configuration.stories.static || './.goat/storybook',
  });
}

module.exports = buildStory;
