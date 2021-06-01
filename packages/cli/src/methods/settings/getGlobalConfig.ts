import { IGoatInternalProjectConfig, notify as Notifier } from '@the-goat/core';
import { constants, promises } from 'fs';
import mkdirp from 'mkdirp';
import settingsRef from '../../references/settings';
import config from './template/.goat.settings';

const { access, writeFile, readFile } = promises;

/**
 * Load the global Goat config
 * @returns {Promise} config
 */
function loadConfig() {
  return readFile(settingsRef.settingsFile, 'utf-8').then((fileContents) => JSON.parse(fileContents));
}

/**
 * Create the global Goat directory
 * @returns {Promise} config
 */
function createGlobalConfig():Promise<IGoatInternalProjectConfig> {
  return new Promise((resolve, reject) => {
    mkdirp(settingsRef.folder)
      .then(async () => {
        writeFile(settingsRef.settingsFile, JSON.stringify(config, null, 2));
        resolve(await loadConfig());
      })
      .catch(reject);
  });
}

/**
 * Check if Global config exists and retrieve it.
 */
export default function getGlobalConfig(): Promise<IGoatInternalProjectConfig> {
  return new Promise((resolve, reject) => {
    access(settingsRef.settingsFile, constants.F_OK)
      .then(async () => {
        try {
          resolve(await loadConfig());
        } catch (error) {
          Notifier.error(
            'The format of the global Goat config is invalid, please fix this manually or remove the file to let Goat reinitialize it',
          );
          // we cannot continue without a valid goat config...?
          process.exit(1);
        }
      })
      .catch(() => {
        createGlobalConfig()
          .then(resolve)
          .catch(reject);
      });
  });
}
