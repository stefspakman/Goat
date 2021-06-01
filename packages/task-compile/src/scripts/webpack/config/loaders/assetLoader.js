/**
 * Get Configured Asset loader
 * @param config
 * @returns {Object} loader object
 */
function getAssetLoader(config) {
  const { resolve } = require('path');
  return {
    test: /.(woff|woff2|ttf|eot|otf|png|svg|jpg|gif)$/,
    loader: require.resolve('file-loader'),
    include: [
      resolve(config.path, 'static'),
    ],
    options: {
      name: '../../[path][name].[ext]',
    },
  };
}

module.exports = getAssetLoader;
