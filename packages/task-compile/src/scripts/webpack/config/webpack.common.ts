import { normalize, resolve, join } from 'path';
import { get } from 'lodash';
import getLoaders from './loaders';
import { TGoatCompileTaskConfig } from './index';
import getPlugins from './plugins';

/**
 * Get webpack config
 * @param {Object} config
 * @returns {Object} webpack configuration object
 */
export default function getCommon(config: TGoatCompileTaskConfig) {
  const { path, configuration, entryFiles } = config;
  const loaders = getLoaders(config);

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
    plugins: getPlugins(config),
    resolve: {
      extensions: ['.js', '.json', '.twig', '.ts', '.tsx'],
      alias: {
        Goat: resolve(join(path, '/.goat')),
      },
      modules: [
        resolve(__dirname, '../../node_modules'), // Add this node_modules folder so we don't need twig and other storybook dependencies inside the project
        'node_modules',
      ],
    },
  };
}
