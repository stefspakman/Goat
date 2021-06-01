import { notify as Notifier, GoatTask } from '@the-goat/core';
import commander, { Command } from 'commander';
import Bluebird from 'bluebird';

// commander.allowUnknownOption(true);

/**
 * Load build capable tasks
 */
async function loadBuildCommands(config: Command, packages: GoatTask[]) {
  const buildPackages = packages.filter((module) => module.method !== undefined);
  Notifier.log(Notifier.style.green('Building Tasks:'));
  return Bluebird.mapSeries(buildPackages, (module) => {
    Notifier.log(Notifier.style.green(`\t- START ${module.name}`));
    const resultPromise = module.actionBase(config);
    if (!resultPromise) {
      Notifier.log(
        Notifier.style.red(
          `\t- NO TASK RESULT FOR ${module.name}: CONTACT SHEPHERD TO FIX PACKAGE`,
        ),
      );
    }
    return resultPromise;
  }).then(() => {
    // return void
  });
}

/**
 * Create Build command
 */
export default function setCommandBuild(packages: GoatTask[]) {
  return new commander.Command('build')
    .command('build')
    .alias('b')
    .description('Build (execute all tasks)')
    .action((config) => loadBuildCommands(config, packages));
}
