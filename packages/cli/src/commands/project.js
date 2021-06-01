import { notify as Notifier, goatConfig } from '@the-goat/core';

const commander = require('commander');
const { projectModules } = require('../methods/modules/listModules');
// const addModule = require('../methods/modules/addModule');

/**
 * Display all project modules
 * @returns {commander.Command}
 */
function commandListModules() {
  return new commander.Command('list')
    .alias('ls')
    .description('List modules')
    .action(projectModules);
}

// function commandAddModules() {
//   return new commander.Command('add')
//     .description('Add modules')
//     .action(addModule);
// }

/**
 * Define module command
 * @returns {commander.Command}
 */
function commandProjectModules() {
  return new commander.Command('module');
}

/**
 * Define project command, includes project management commands
 * @returns {commander.Command}
 */
function commandProject() {
  const program = new commander.Command('project')
    .description('Manage project')
    .action(async () => {
      try {
        await goatConfig();
      } catch (error) {
        Notifier.error(error.message);
      }
      program.help();
    });
  return program;
}

/**
 * Create Project command
 * @returns {commander.Command}
 */
export default function buildCommand() {
  const programModule = commandProjectModules();
  programModule.addCommand(commandListModules());
  // programModule.addCommand(commandAddModules());
  const program = commandProject();
  program.addCommand(programModule);
  return program;
}
