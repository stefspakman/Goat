import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import Notifier from '../notifier';
import schemaBase from '../schemas/schema';
import checkSchema from '../validators/schema';
import checkVersion from '../validators/version';
import { IGoatExternalProjectConfig } from './index';

const configPath = resolve('./goat.config.json');

/**
 * Parse configuration object
 * @returns
 */
function parseConfig(config: string) {
  try {
    return JSON.parse(config);
  } catch (error) {
    Notifier.error('Your config file is not valid JSON, please check your config file');
    process.exit();
    return null;
  }
}

/**
 * Get configuration object
 */
export function getConfig(): IGoatExternalProjectConfig | null {
  if (!existsSync(configPath)) {
    Notifier.error(
      "No config file could be found, please check your path or create a 'goat.config.json' file",
    );
    return null;
  }
  // Read config
  return parseConfig(readFileSync(configPath, 'utf-8'));
}

/**
 * Validate configuration object
 * @returns
 */
export function validateConfig(config: IGoatExternalProjectConfig) {
  if (!checkVersion(config.version)) {
    throw new Error('Invalid Goat-version');
  }

  let isValid = true;

  // Validate used config
  if (!checkSchema(config, schemaBase)) {
    isValid = false;
  }

  // Validate config version
  if (!config.version) {
    isValid = false;
  }
  return isValid;
}
