const { join } = require('path');
const goatGonfig = require('../config.js').config;

const stories = goatGonfig.configuration.locations.stories.map(({ directory, pattern }) => join(goatGonfig.path, directory, pattern));
module.exports = {
  stories,
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-knobs',
  ],
  webpackFinal(config) {
    return config;
  },
};
