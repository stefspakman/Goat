// @ts-ignore
import { validRange, satisfies } from 'semver';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import Notifier from '../notifier';

const projectConfig = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf-8'));
/**
 * Check if the current Goat version matches the local project settings
 */
export default function checkVersion(version: string): boolean {
  if (!validRange(version)) {
    Notifier.error(
      `the configured ${projectConfig.name} version: ${Notifier.script(
        version,
      )} is not a valid semver version or semver range, please check the configured version`,
    );
    return false;
  }
  const isValid = satisfies(projectConfig.version, version);
  if (!isValid) {
    Notifier.error(
      `The current installed version of ${
        projectConfig.name
      } does not satisfy the configs needs. \nCurrently: ${
        projectConfig.version
      }\nNeeds: ${version}\nPlease update ${projectConfig.name} by running ${Notifier.script(
        `npm install ${projectConfig.name} -g`,
      )}`,
    );
    return false;
  }
  return isValid;
}
