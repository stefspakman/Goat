import { merge } from 'lodash';
import { promises } from 'fs';
import getPackageConfig from './getPackageConfig';

/**
 * Collect project config from included packages and write to a config file.
 * @param {Object} answers
 */
export default function initializeProjectConfig(answers: { project_name: string }, packages: {}[]) {
  let projectConfiguration = {
    name: answers.project_name,
    version: '2.x',
  };
  packages.forEach((pckg) => {
    projectConfiguration = merge(projectConfiguration, getPackageConfig(pckg));
  });
  return promises.writeFile('goat.config.json', JSON.stringify(projectConfiguration, null, 2));
}
