import { GoatTask, TGoatTaskMethodConfig } from '@the-goat/core';

const method = async (config: TGoatTaskMethodConfig) => {
  const { runAll } = require('./scripts/generateIconfont');
  return runAll(config);
};

export default () => new GoatTask({
  name: 'Icons',
  command: 'icons',
  description: 'Generate icon font files based on svg files',
  schema: require('./schema/schema.js'),
  method,
  watch(config) {
    if (!config.configuration.locations.icons) {
      throw new Error('Missing icons location');
    }
    if (!config.events) {
      throw new Error('Missing Watchable eventemitter');
    }

    const { runAll, runSingle } = require('./scripts/generateIconfont');
    runAll(config);
    config.events.watch({
      name: 'Icons',
      pattern: `${config.configuration.locations.icons.src}/**/*.svg`,
      events: /file:/,
      method: (item: { path: string }) => {
        runSingle(config, item.path);
      },
    });
  },
});

export { method };
