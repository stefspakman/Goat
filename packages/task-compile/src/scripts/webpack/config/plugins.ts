import { ProgressPlugin, version } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import BabelEsmPlugin from 'babel-esm-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { TGoatCompileTaskConfig } from './index';

/**
 * Collect Webpack plugins
 * @param {object} config
 * @returns {Array} an array of plugins
 */
export default function getPlugins(config: TGoatCompileTaskConfig) {
  if (!version) {
    throw new Error('Could not define Webpack version');
  }

  const isWebpack4 = /^4\./.test(version);
  const isWebpack5 = /^5\./.test(version);

  const plugins = [
    new FriendlyErrorsWebpackPlugin(),
    new ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ];

  if (isWebpack4) {
    plugins.push(new FixStyleOnlyEntriesPlugin());
  }

  if (isWebpack5) {
    plugins.push(new RemoveEmptyScriptsPlugin());
  }

  if (config.configuration.bundler.js.esm) {
    plugins.push(
      new BabelEsmPlugin({
        filename: '[name].esm.js',
        chunkFilename: '[id].esm.js',
      }),
    );
  }

  if (config.configuration.bundler.clean) {
    const { dist } = config.configuration.locations;
    plugins.push(
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [`${dist}/**/*`],
      }),
    );
  }

  if (config.settings && config.settings.analyse) {
    plugins.push(
      new BundleAnalyzerPlugin({
        excludeAssets: (assetName: string) => assetName.includes('.esm.js'),
      }),
    );
  }

  return plugins;
}
