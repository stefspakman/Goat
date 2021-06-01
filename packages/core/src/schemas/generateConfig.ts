// @ts-ignore
import defaults from 'json-schema-defaults';
import { JSONSchema6 } from 'json-schema';

export default function generateConfig(schema: JSONSchema6) {
  return defaults(schema);
}
