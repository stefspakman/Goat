import { GoatTask, notify as notifier } from '@the-goat/core';
import runStory from './scripts/storybook/runStory';
import buildStory from './scripts/storybook/buildStory';
import files from './init/files';

export default () => new GoatTask({
  name: 'Storybook',
  command: 'story',
  description: 'Manage a design system using storybook',
  schema: require('./schema/schema'),
  options: [
    {
      label: 'Build',
      flags: '-b, --build',
      allowOnOnce: true,
      allowOnWatch: true,
    },
    {
      label: 'Include storybook when watching',
      flags: '--story',
      allowOnOnce: false,
      allowOnWatch: true,
    },
  ],
  async method(config) {
    // @ts-ignore
    if (config.options.story) {
      runStory(config);
      return;
    }
    buildStory(config);
  },
  watch(config) {
    // @ts-ignore
    if (!config.options.story) {
      notifier.info(
        'Skipping Storybook while watching, to include storybook run watch with the --story flag',
      );
      return;
    }
    runStory(config);
  },
  init: {
    files: () => files,
  },
});
