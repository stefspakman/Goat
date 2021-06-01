import { readFileSync } from 'fs';
import { resolve } from 'path';
import Notifier from '../../notifier';
import { IGoatInternalProjectConfig } from '..';

const { version } = JSON.parse(readFileSync(resolve(__dirname, '../../../package.json'), 'utf-8'));

/**
 * If current goat config does not match the current goat version, check if the config can be updated, otherwise prompt the user to reinitialize
 */
async function updateConfig(config: IGoatInternalProjectConfig) {
  const { writeFile } = require('fs').promises;
  const { lte } = require('semver');
  const { normalize } = require('path');
  const configFile = './.goat/config';

  let newConfig = config;
  if (lte(newConfig.goatVersion, '1.4.0')) {
    const upgrade = require('../versionUpgrades/upgrade-1-4-0');
    newConfig = upgrade(newConfig);
  }
  newConfig.goatVersion = version;
  await writeFile(normalize(configFile), JSON.stringify(newConfig, null, 2));
  Notifier.log('The Goat version of this project has been updated, no further changes needed');
  return newConfig;
}

module.exports = updateConfig;
