import { generateConfig } from '@the-goat/core';
import { merge } from 'lodash';

/**
 * Get config of packages
 * @param {array} pckg
 * @returns {object}
 */
export default function getPackageConfig(pckg: any) {
  if (!Array.isArray(pckg)) {
    return generateConfig(pckg.init.schema);
  }

  return pckg.reduce((result = {}, currentValue) => {
    const config = generateConfig(currentValue.init.schema);
    return merge(result, config);
  });
}
