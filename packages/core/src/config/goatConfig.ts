import { resolve } from 'path';
import { promises, readFileSync } from 'fs';
import {
  gt, satisfies, major, minor,
} from 'semver';
import Notifier from '../notifier';
import { IGoatInternalProjectConfig } from './index';

const { version } = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf-8'));

const configFile = resolve('./.goat/config');

const { readFile, stat } = promises;

/**
 * Check if goat is initialized and get the config
 */
export default async function goatConfig(): Promise<IGoatInternalProjectConfig> {
  try {
    await stat('./.goat');
  } catch (e) {
    const error = new Error(
      `No Goat project seems to be initiated here, please check your path or run ${Notifier.script(
        'goat init',
      )}`,
    );
    error.name = 'NO_GOAT_PROJECT';
    throw error;
  }

  const config = JSON.parse(await readFile(configFile, 'utf-8'));
  const goatVersion = `${major(version)}.${minor(version)}.x`;
  if (satisfies(config.goatVersion, goatVersion)) {
    return config;
  }
  if (gt(version, config.goatVersion)) {
    const updateConfig = require('./modules/updateConfig');
    return updateConfig(config);
  }
  // If the version doesn't match on Minor,
  throw new Error('This project requires a newer version of Goat, please update');
}
