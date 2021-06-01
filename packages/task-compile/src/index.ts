import { GoatTask } from '@the-goat/core';
import { runAll, runWatch } from './scripts/webpack/runner';
import schema from './schema';
import files from './init/files';

export default () => new GoatTask({
  name: 'Compile',
  command: 'compile',
  description: 'Webpack based compiler for TypeScript, JavaScript and SCSS',
  schema,
  options: [
    {
      label: 'Compile for production',
      flags: '-p, --production',
      allowOnOnce: true,
      allowOnWatch: true,
    },
    {
      label: 'Analyse javascript dependency sizes',
      flags: '-a, --analyse',
      allowOnOnce: true,
      allowOnWatch: false,
    },
  ],
  async method(config) {
    return runAll(config);
  },
  watch(config) {
    runWatch(config);
  },
  init: {
    files: () => files,
  },
});
