import { notify as Notifier, goatConfig, IGoatInternalProjectConfig } from '@the-goat/core';

import collectModules from './collectModules';

/**
 * Format module data to a printable array
 */
function formatModules(items: IGoatInternalProjectConfig['modules']) {
  const modules:{ [key:string]: { Name: string, Description: string } } = {};
  items.forEach((module) => {
    const content = (({ name, description = '' }) => ({ Name: name, Description: description }))(
      module,
    );
    modules[module.package] = content;
  });
  return modules;
}

/**
 * Display a table listing all available modules
 */
async function listModules() {
  const modules = await collectModules;
  const internalModules = modules.filter((module) => !module.global);
  const installedModules = modules.filter((module) => module.global);

  Notifier.log('Modules bundled with your version of Goat:');
  console.table(formatModules(internalModules));
  Notifier.log('\n');
  Notifier.log('Modules installed on your system:');
  console.table(formatModules(installedModules));
  Notifier.log(
    `* You can add new modules by running ${Notifier.script('goat module add MODULE_NAME')}`,
  );
  Notifier.log(
    `* You can remove modules by running ${Notifier.script('goat module remove MODULE_NAME')}`,
  );
}

/**
 * Display a table with modules included in the current project
 */
async function projectModules() {
  try {
    const config = await goatConfig();
    const formatted = formatModules(config.modules);
    console.table(formatted);
  } catch (error) {
    Notifier.error(error.message);
  }
}

module.exports = { listModules, projectModules };
