import { merge } from 'lodash';
import { writeFileSync } from 'fs';
import { JSONSchema6 } from 'json-schema';
import Notifier from '../notifier';
import generateConfig from './generateConfig';
import { getConfig } from '../config/config';

export default async function writeConfig(schema: JSONSchema6) {
  const configuration = await getConfig();
  const schemaConfig = generateConfig(schema);
  // make sure any task-specific configuration is maintained
  const projectConfiguration = merge({}, configuration, schemaConfig, configuration);
  if (JSON.stringify(configuration) === JSON.stringify(projectConfiguration)) {
    throw new Error(
      "Couldn't update the configuration, please check the configuration yourself and/or notify the developer",
    );
  }
  writeFileSync('goat.config.json', JSON.stringify(projectConfiguration, null, 2));
  Notifier.log(
    `${Notifier.emoji(
      'white_check_mark',
    )}  updated the configuration, please check your settings before running your command again`,
  );
  return projectConfiguration;
}
