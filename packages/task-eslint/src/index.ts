import { GoatTask } from '@the-goat/core';

export default () => new GoatTask({
  name: 'Eslint',
  command: 'eslint',
  description: 'Run eslint',
  schema: require('../scripts/schema'),
  method: (config) => {
    const { processEslint } = require('../scripts/eslint');
    return new Promise((resolve) => {
      const { configuration } = config;
      if (!configuration.locations.javascript) {
        throw new Error('Missing JavaScript location');
      }
      const sources = Array.isArray(configuration.locations.javascript.src)
        ? configuration.locations.javascript.src
        : [configuration.locations.javascript.src];
      processEslint({
        ...config,
        sources,
      });
      resolve();
    });
  },
  watch: (config) => {
    const { processEslint, processEslintFile } = require('../scripts/eslint');
    const { normalize } = require('path');
    const { configuration, events } = config;
    if (!configuration.locations.javascript) {
      throw new Error('Missing JavaScript location');
    }
    if (!events) {
      throw new Error('Missing Watchable eventemitter');
    }
    const sources: string[] = Array.isArray(configuration.locations.javascript.src)
      ? configuration.locations.javascript.src
      : [configuration.locations.javascript.src];
    processEslint({
      ...config,
      sources,
    });
    const paths = sources.map((item) => normalize(`${item}/**/*.es6.js`));
    events.watch({
      name: 'Eslint',
      pattern: paths,
      events: /file:/,
      method: (data: { path: string }) => {
        processEslintFile({
          ...config,
          file: data.path,
        });
      },
    });
  },
});
