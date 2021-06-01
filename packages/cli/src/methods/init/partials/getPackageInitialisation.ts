import { GoatTask } from '@the-goat/core';
import loadModule from '../../modules/loadModule';

/**
 * Get init settings of a package
 */
function getPackageInitSettings(packageConfigs: Array<() => GoatTask> | (() => GoatTask)) {
  if (!Array.isArray(packageConfigs)) {
    const config = packageConfigs();
    return {
      ...config.init,
      schema: config.schema,
    };
  }
  return packageConfigs.map((packageConfig) => {
    const config = packageConfig();
    return {
      ...config.init,
      schema: config.schema,
    };
  });
}

/**
 * Collect initialisation settings for packages
 */
export default function getPackageInitialisation(packages: Array<any>): any[] {
  return packages.map((module) => {
    const packageConfig = loadModule(module);
    return {
      module,
      package: packageConfig,
      init: getPackageInitSettings(packageConfig),
    };
  });
}
