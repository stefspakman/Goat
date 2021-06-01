/**
 * Get the Webpack setup
 * @param {Object} { path, configuration, entryFiles, ts }
 * @returns {Object}
 */
function getWebpackSetup({
  path, configuration, entryFiles, ts,
}) {
  const { normalize, resolve } = require('path');
  const webpack = require('webpack');
  const { get } = require('lodash');
  return webpack({
    mode: get(configuration, 'mode') || 'production',
    context: path,
    devtool: get(configuration, 'bundler.js.devtool') || false,
    entry: entryFiles,
    output: {
      filename: get(configuration, 'bundler.js.output.filename') || '[name].bundle.js',
      path: normalize(path),
      publicPath: get(configuration, 'bundler.js.output.publicPath'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [
                  require('babel-plugin-lodash'),
                  [
                    require('babel-plugin-root-import'),
                    {
                      rootPathPrefix: '@/',
                    },
                  ],
                ],
                presets: [
                  [
                    require('@babel/preset-env'),
                    {
                      targets: configuration.browserSupport,
                    },
                  ],
                ],
              },
            },
          ],
        },
        ts ? {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('cache-loader'),
            },
            {
              loader: require.resolve('ts-loader'),
              options: {
                configFile: resolve(__dirname, './tsconfig.json'),
              },
            },
          ],
        } : {},
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  });
}

module.exports = getWebpackSetup;
