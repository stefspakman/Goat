import { GoatTask } from '@the-goat/core';

export default () => new GoatTask({
  name: 'Modernizr',
  command: 'modernizr',
  description: 'Generate a custom Modernizr file',
  schema: require('./scripts/schema'),
  method: (config) => {
    const buildModernizr = require('./scripts/modernizr');
    buildModernizr(config);
    return Promise.resolve();
  },
});
