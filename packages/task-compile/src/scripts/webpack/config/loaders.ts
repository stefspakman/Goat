import { TGoatTaskMethodConfig } from '@the-goat/core';
import tsLoader from './loaders/tsLoader';
import jsLoader from './loaders/jsLoader';
import styleLoader from './loaders/styleLoader';
import assetLoader from './loaders/assetLoader';
/**
 * Collect Loaders
 * @param {Object} config
 * @returns {Array} an array of loaders
 */
export default function getLoaders(config: TGoatTaskMethodConfig) {
  const loaders = [];

  if (config.configuration.handlers.javascript) {
    loaders.push(tsLoader(config));
    loaders.push(jsLoader(config));
  }
  if (config.configuration.handlers.styles) {
    loaders.push(styleLoader(config));
  }
  if (config.configuration.handlers.assets) {
    loaders.push(assetLoader(config));
  }
  return loaders;
}
