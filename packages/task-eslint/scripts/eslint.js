import { notify as Notifier } from '@the-goat/core';

const { Linter } = require('eslint');
const eslintConfig = require('eslint-config-airbnb-base');
const {
  readFile,
} = require('fs');
const {
  normalize,
} = require('path');
const getFiles = require('./helpers/readdir');

/**
 * Process single js / es6.js file
 * @param {Object} config
 */
const processEslintFile = (config) => {
  const {
    file,
    configuration,
    path,
    events,
  } = config;
  const { eslint } = configuration;
  readFile(file, async (err, data) => {
    if (err) throw err;
    const result = lint(data.toString(), { ...eslint, es6: file.includes('.es6.') });
    if (result.length > 0) {
      Notifier.error(`Error(s) on ${file.replace(path, '')}`);
      result.forEach((item) => {
        const message = `\t- ${item.ruleId}: ${item.message} on ${item.line}:${item.column}${item.endLine ? ` to ${item.endLine}:${item.endColumn}` : ''}`;
        if (item.severity === 2) {
          Notifier.log(Notifier.style.red(message));
        } else if (item.severity === 1) {
          Notifier.log(Notifier.style.yellow(message));
        } else {
          Notifier.log(Notifier.style.green(message));
        }
      });
      Notifier.log('\n');
    }
    if (events) {
      events.emit({
        event: 'js:lint',
        path: file,
        properties: {
          result,
        },
      });
    }
  });
};

/**
 * Lint the JS data based on the AirBnb linting rules
 * @param {String} data - Contents of JS file
 * @param {Object} config - Object containing the additional eslint config
 * @returns {Object} result
 */
const lint = (data, config) => {
  const linter = new Linter();
  return linter.verify(data, {
    env: {
      browser: true,
      es6: config.es6,
    },
    extends: eslintConfig,
    parserOptions: {
      parser: 'babel-eslint',
    },
    ...config.config,
  });
};

/**
 * Process all files
 * @param {Object} config
 */
const processEslint = (config) => {
  const { sources, path } = config;
  sources.forEach((source) => {
    (async (filePath) => {
      for await (const file of getFiles(filePath, /\.js$/gm)) {
        if ((/\.config\.js$/gm).test(file)) {
          continue;
        }
        processEslintFile({
          ...config,
          file,
        });
      }
    })(normalize(`${path}/${source}`));
  });
};

module.exports = { processEslint, processEslintFile };
