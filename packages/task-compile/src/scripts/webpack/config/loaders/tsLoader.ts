import { TGoatTaskMethodConfig } from '@the-goat/core';
import { resolve } from 'path';

/**
 * Get Configured TypeScript loader
 */
export default function getTsLoader(config: TGoatTaskMethodConfig) {
  return {
    test: /\.tsx?$/,
    exclude: resolve(config.path, 'node_modules'),
    loader: require.resolve('ts-loader'),
  };
}
