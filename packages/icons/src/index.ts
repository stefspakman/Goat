import { Goat } from '@the-goat/goat';

export default () => new Goat({
  name: 'Icons',
  command: 'icons',
  description: 'Generate icon font files based on svg files',
  schema: require('./schema/schema.js'),
  async method(config) {
    const { runAll } = require('./scripts/generateIconfont');
    return runAll(config);
  },
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
