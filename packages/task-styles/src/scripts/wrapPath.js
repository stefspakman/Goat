const { normalize } = require('path');

/**
 * @function  [wrapPath]
 * @returns {array} paths
 */
function wrapPath(paths, prefix, suffix = '', extra = []) {
  return [
    ...Array.isArray(paths) ? (paths).map(item => normalize(`${prefix}${item}${suffix}`)) : [normalize(`${prefix}${paths}${suffix}`)],
    ...extra
  ];
}

module.exports = wrapPath;