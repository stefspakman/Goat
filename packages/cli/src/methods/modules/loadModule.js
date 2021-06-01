import { notify as Notifier } from '@the-goat/core';

const importGlobal = require('import-global');

/**
 * Require local or global module
 * @param {Object} module
 * @returns module
 */
function loadModule(module) {
  if (!module.global) {
    try {
      // eslint-disable-next-line import/no-dynamic-require
      return require(module.package).default;
    } catch (error) {
      console.log(error);
      Notifier.error(`The module ${module.package} could not be loaded, please try updating goat or remove the module from your project config.`);
      process.exit();
    }
  }
  try {
    return importGlobal(module.package);
  } catch (error) {
    Notifier.error(`The module ${module.package} doesn't seem to be installed on your system`);
    Notifier.log(`Please install by running: ${Notifier.script(`goat module add ${module.package}`)}`);
    process.exit();
  }

  throw new Error('Load module failed');
}

export default loadModule;
