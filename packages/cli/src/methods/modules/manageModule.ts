import { GoatTask, IGoatInternalProjectConfig, notify as Notifier } from '@the-goat/core';
import importGlobal from 'import-global';
import { promisify } from 'util';
import { exec } from 'child_process';
import getGlobalConfig from '../settings/getGlobalConfig';
import updateGlobalSettings from '../settings/updateGlobalSettings';
import confirm from '../helpers/confirm';

const execAsync = promisify(exec);

/**
 * Check if the module is added to the global settings
 */
function checkInstalledModules(config: IGoatInternalProjectConfig, module: string): boolean {
  return Boolean(config.modules.filter((item) => item.package === module).length);
}

/**
 * Install module using NPM
 */
function installModule(module: string) {
  return execAsync(`npm install ${module} -g`);
}

/**
 * Uninstall module from the system
 */
function uninstallModule(module: string) {
  return execAsync(`npm uninstall ${module} -g`);
}

/**
 * Add module details to the global settings
 */
function addToSettings(config: IGoatInternalProjectConfig, moduleConfig: { name: string, goat: GoatTask, description: string }, isDefault = false) {
  config.modules.push({
    name: moduleConfig.goat.name,
    package: moduleConfig.name,
    description: moduleConfig.goat.description || moduleConfig.description,
    default: isDefault,
  });
  return updateGlobalSettings(config);
}

/**
 * Remove module details from the global settings
 */
function removeFromSettings(config: IGoatInternalProjectConfig, module:string) {
  // eslint-disable-next-line no-param-reassign
  config.modules = config.modules.filter((item) => item.package !== module);
  return updateGlobalSettings(config);
}

/**
 * Action to remove a module from Goat
 */
export async function actionRemoveModule(module:string) {
  const config = await getGlobalConfig();
  if (!checkInstalledModules(config, module)) {
    Notifier.error(`${module} is not installed`);
    process.exit();
  }
  const confirmUninstallModule = await confirm({
    message: 'Do you want to uninstall this module completely?',
    default: false,
  });
  if (confirmUninstallModule) {
    await uninstallModule(module);
  }
  removeFromSettings(config, module);
  Notifier.log(`${module} is succesfully removed`);
}

/**
 * Get the package.json file of the requested module. If the module does not exist, install it
 */
async function getModulePackage(module:string) {
  try {
    return importGlobal(`${module}/package.json`);
  } catch ({ code }) {
    if (code !== 'MODULE_NOT_FOUND') {
      throw new Error(`Error: ${code}`);
    }
    Notifier.log(`${module} is not yet installed, installing it now`);
    await installModule(module);
    return importGlobal(`${module}/package.json`);
  }
}

/**
 * Action to add a module to Goat
 */
export async function actionAddModule(module:string) {
  const config = await getGlobalConfig();
  if (checkInstalledModules(config, module)) {
    Notifier.error(`${module} is already installed`);
    process.exit();
  }
  const modulePacakge = await getModulePackage(module);
  if (!modulePacakge.goat) {
    Notifier.error(`${module} doesn't seem to be a Goat Module`);
    const confirmUninstallModule = await confirm({
      message: 'Do you want to uninstall this module?',
      default: false,
    });
    if (confirmUninstallModule) {
      await uninstallModule(module);
    }
    process.exit();
  }
  addToSettings(config, modulePacakge);
  Notifier.log(`${module} is succesfully installed`);
}
