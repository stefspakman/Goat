import { TGoatTaskMethodConfig } from '@the-goat/core';
import { flattenDeep, get } from 'lodash';
import { sync } from 'glob';
import { normalize, resolve as pathResolve } from 'path';
import minimatch from 'minimatch';

export type TGoatCompileTaskConfig = TGoatTaskMethodConfig & {
  entryFiles: {};
  files: string[];
  path: string;
  settings?: {
    production: boolean;
    analyse?: boolean;
  };
};

/**
 * Get the destination for each file
 */
function getDest(config: TGoatTaskMethodConfig, el: string): string {
  const { dist, patterns } = config.configuration.locations;
  const { path } = config;
  const name = el.substring(0, el.lastIndexOf('.')).replace(`${path}/`, '').replace('.es6', '');
  if (dist === '<source>') {
    return name;
  }
  if (get(config, 'configuration.bundler.destination.flat')) {
    return name.replace(name.substring(0, name.lastIndexOf('/')), dist);
  }

  const matchesPattern = patterns.find((pattern) => minimatch(el, `${normalize(path)}/${pattern.directory}/${pattern.pattern}`));
  if (!matchesPattern) {
    throw new Error('Pattern not found');
  }
  return name.replace(matchesPattern.directory, dist);
}

export function getCompileTaskConfig(
  config: TGoatTaskMethodConfig,
): TGoatCompileTaskConfig {
  const files = flattenDeep<string>(
    config.configuration.locations.patterns.map((pattern) => sync(`${normalize(config.path)}/${pattern.directory}/${pattern.pattern}`)),
  );
  return {
    ...config,
    files,
    entryFiles: files.reduce((obj, el) => {
      const destination = getDest(config, el);
      return {
        ...obj,
        [destination]: pathResolve(el),
      };
    }, {}),
  } as TGoatCompileTaskConfig;
}
