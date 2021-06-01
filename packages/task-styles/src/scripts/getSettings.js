const wrapPath = require('./wrapPath');

/**
 * @function  [getSettings]
 * @returns {object} settings
 */
function getSettings({
  path,
  configuration
}) {
  return {
    source: wrapPath(configuration.locations.styles.src, `${path}/`, '/**/*.s+(a|c)ss', []),
    dest: [`${path}/${configuration.locations.styles.dist}`],
    ignore: ['**/+*', '**/~*'], //Ignore scss files prefixed by ~ and +, these files need to be specifically imported
  };
}

module.exports = getSettings;