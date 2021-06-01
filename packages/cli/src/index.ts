import { notify as Notifier, goatConfig } from '@the-goat/core';

import updateNotifier from 'update-notifier';
import commander from 'commander';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import CollectCommands from './methods/commands/CollectCommands';
import getPackages from './packages/getPackages';
import setCommandWatch from './commands/watch';
import setCommandBuild from './commands/build';
import setCommandModule from './commands/module';
import setCommandProject from './commands/project';

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));
const goat = new commander.Command();

export default async function base() {
  updateNotifier({ pkg }).notify();
  goat
    .version(pkg.version, '-v, -V, --version', 'output the current version')
    .name('Goat')
    .description('Goat');

  let config;
  try {
    config = await goatConfig();
  } catch (error) {
    const setCommandInit = require('./commands/init');
    goat.addCommand(setCommandInit());
    if (process.argv.length === 2) {
      Notifier.error(error.message);
    }
  }

  if (config) {
    const packages = await getPackages(config);
    const moduleCommands = await CollectCommands(packages);
    if (moduleCommands) {
      moduleCommands.forEach((command) => {
        goat.addCommand(command);
      });
      goat.addCommand(setCommandWatch(packages));
      goat.addCommand(setCommandBuild(packages));
    }
  }

  goat.addCommand(setCommandProject());
  goat.addCommand(setCommandModule());
  goat.allowUnknownOption(true);
  goat.parse(process.argv);
}
