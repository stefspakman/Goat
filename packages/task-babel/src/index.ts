import { GoatTask } from '@the-goat/core';

export default () => new GoatTask({
  name: 'Babel',
  command: 'babel',
  description: 'Compile .es6.js files using babel',
  schema: require('../scripts/schema'),
  method: (config) => {
    const { processBabel } = require('../scripts/babel');
    return new Promise((resolve) => {
      const { configuration } = config;
      if (!configuration.locations.javascript) {
        throw new Error('Missing JavaScript location');
      }
      const sources = Array.isArray(configuration.locations.javascript.src)
        ? configuration.locations.javascript.src
        : [configuration.locations.javascript.src];
      processBabel({
        ...config,
        sources,
      });
      resolve();
    });
  },
  watch: (config) => {
    const { normalize } = require('path');
    const { processBabel, processBabelFile } = require('../scripts/babel');
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
    processBabel({
      ...config,
      sources,
    });
    const paths = sources.map((item) => normalize(`${item}/**/*.es6.js`));
    events.watch({
      name: 'Babel',
      pattern: paths,
      events: /file:/,
      method: (data: { path: string }) => {
        processBabelFile({
          ...config,
          file: data.path,
        });
      },
    });
  },
});
