module.exports = (Goat) => {
  return new Goat({
    name: 'JS Bundler',
    command: 'js',
    description: 'Bundle Javascript',
    schema: require('./scripts/schema'),
    method(config) {
      const { runAll } = require('./scripts/runner')
      runAll(config);
    },
    watch(config) {
      const { normalize } = require('path');
      const { runAll, runSingle } = require('./scripts/runner')
      const { configuration, events } = config;
      const sources = typeof configuration.locations.javascript.src === 'Array' ? configuration.locations.javascript.src : [configuration.locations.javascript.src];
      const paths = sources.map(item => normalize(`${item}/**/*.+(es6.js|ts)`));
      runAll(config);
      events.watch({
        name: 'Babel',
        pattern: paths,
        events: /file:/,
        method: (data) => runSingle(config, data.path),
      });
    },
    init: {
      configuration: require('./init/configuration.json'),
    },
  });
};
 