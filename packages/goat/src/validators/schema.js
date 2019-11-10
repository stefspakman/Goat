const { validate } = require('jsonschema');
const GoatNotifier = require('../notifier/notifier');

const Notifier = new GoatNotifier();

/**
 * Validate the config object against the provided schema
 * @param {Object} config
 * @param {Object} schema
 * @returns {Boolean} isValid
 */
const checkSchema = (config, schema) => {
  const result = validate(config, schema);
  if (result.errors.length === 0) {
    return true;
  }
  result.errors.forEach((error) => {
    Notifier.error(`${error.property.replace('instance.', '')} ${error.message}`);
  });
  return false;
};

module.exports = checkSchema;