import { Stats } from 'webpack';
import { TGoatTaskMethodConfig } from '@the-goat/core';
import { getCompileTaskConfig, TGoatCompileTaskConfig } from './config';
import getWebpackSetup from './webpack';

let logHash: string | undefined;

/**
 * Log Webpack results
 */
function logWebpack(error: Error, stats: Stats) {
  if (error) {
    console.error(error);
    return;
  }
  if (stats.hash === logHash) {
    return;
  }
  logHash = stats.hash;

  console.info(
    stats.toString({
      assetsSort: '!size',
      usedExports: false,
      entrypoints: false,
      excludeAssets: [/\.*\.map/], // Hide source maps from output
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false,
    }),
  );
}

/**
 * Run webpack
 */
function run(config: TGoatCompileTaskConfig) {
  const compiler = getWebpackSetup(config);
  return new Promise<void>((resolve, reject) => {
    compiler.run((error: Error, stats: Stats) => {
      logWebpack(error, stats);
      if (error) {
        reject(error);
        return;
      }
      if (stats.compilation.errors.length) {
        reject(stats.compilation.errors[0]);
        return;
      }
      resolve();
    });
  });
}

/**
 * Run webpack
 */
export function watch(config: TGoatCompileTaskConfig) {
  const compiler = getWebpackSetup(config);
  compiler.watch(
    {
      aggregateTimeout: 300,
      poll: undefined,
    },
    logWebpack,
  );
}

/**
 * Entry for all file mode
 * @param {Object} config
 */
export function runAll(config: TGoatTaskMethodConfig) {
  return run(getCompileTaskConfig(config));
}

/**
 * Entry for watching
 * @param {Object} config
 */
export function runWatch(config: TGoatTaskMethodConfig) {
  watch({
    ...getCompileTaskConfig(config),
    settings: {
      // @ts-ignore
      production: !!config.options.production,
    },
  } as TGoatCompileTaskConfig);
}
