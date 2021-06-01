// @ts-ignore
import { validate } from 'jsonschema';
import Notifier from '../notifier';
import { IGoatExternalProjectConfig } from '../config';

/**
 * Validate the config object against the provided schema
 */
export default function checkSchema(config: IGoatExternalProjectConfig, schema: {}) {
  const result = validate(config, schema);
  if (result.errors.length === 0) {
    return true;
  }
  result.errors.forEach((error) => {
    Notifier.error(`${error.property.replace('instance.', '')} ${error.message}`);
  });
  return false;
}
