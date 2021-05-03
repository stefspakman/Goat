/**
 * Get webpack config
 * @param {Object} config
 * @returns {Object} webpack configuration object
 */
module.exports = function getCommon(config) {
  const { path, configuration, entryFiles } = config;
  const loaders = require('./loaders')(config);
  const plugins = require('./plugins')(config);
  const { normalize, resolve, join } = require('path');
  const { get } = require('lodash');
  return {
    context: path,
    entry: entryFiles,
    output: {
      filename: get(configuration, 'bundler.js.output.filename') || '[name].bundle.js',
      path: normalize(path),
      publicPath: get(configuration, 'bundler.js.output.publicPath'),
    },
    module: {
      rules: loaders,
    },
    plugins,
    resolve: {
      extensions: ['.js', '.json', '.twig'],
      alias: {
        Goat: resolve(join(path, '/.goat')),
      },
      modules: [
        resolve(__dirname, '../../node_modules'), // Add this node_modules folder so we don't need twig and other storybook dependencies inside the project
        'node_modules',
      ],
    },
  };
};
