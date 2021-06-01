/**
 * Collect and format namespaces
 * @param {Object} config
 * @returns {Object} namespaces
 */
function getNameSpaces(config) {
  const { resolve } = require('path');
  const { namespaces } = config.configuration.stories;
  return Object.entries(namespaces).reduce((accumulator, { 0: key, 1: value }) => {
    accumulator[key] = resolve(config.path, value);
    return accumulator;
  }, {});
}

module.exports = getNameSpaces;
