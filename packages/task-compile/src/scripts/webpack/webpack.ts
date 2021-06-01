/**
 * Get the Webpack Production setup
 * @returns {Object}
 */
import { TGoatTaskMethodConfig } from '@the-goat/core';
import { merge } from 'webpack-merge';
import webpack from 'webpack';
import getCommon from './config/webpack.common';
import { TGoatCompileTaskConfig } from './config';

function getWebpackProductionSetup() {
  return {
    mode: 'production',
  };
}

/**
 * Get the Webpack Development setup
 * @returns {Object}
 */
function getWebpackDevelopmentSetup() {
  return {
    mode: 'development',
    devtool: 'source-map',
  };
}

function modifyWebpackConfig(config: TGoatTaskMethodConfig, instance: any) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const modifyWebpack = require(`${config.path}/.goat/webpack`).webpack(instance);
    if (
      !modifyWebpack
      || (Object.keys(modifyWebpack).length === 0 && modifyWebpack.constructor === Object)
    ) {
      return instance;
    }
    return modifyWebpack;
  } catch (e) {
    return instance;
  }
}

/**
 * Get the Webpack setup
 * @returns {Object}
 */
export default function getWebpackSetup(config: TGoatCompileTaskConfig) {
  const common = getCommon(config);
  const setup = config.settings && config.settings.production
    ? getWebpackProductionSetup()
    : getWebpackDevelopmentSetup();
  const instance = modifyWebpackConfig(config, merge(common, setup as any));
  return webpack(instance);
}
