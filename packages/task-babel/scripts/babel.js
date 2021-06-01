const babel = require('@babel/core');
const {
  readFile,
  writeFile,
  mkdir,
} = require('fs');
const {
  normalize,
} = require('path');
const {
  get,
} = require('lodash');
const getFiles = require('./helpers/readdir');

async function fileRollup({ code }) {
  const { rollup } = require('rollup');
  const virtual = require('@rollup/plugin-virtual');
  const { nodeResolve } = require('@rollup/plugin-node-resolve');

  const input = await rollup({
    input: 'entry',
    // ...
    plugins: [
      virtual({
        entry: code,
      }),
      nodeResolve(),
    ],
  });
  const { output } = await input.generate({
    plugins: [
      {
        name: 'extract',
        generateBundle(outputOptions, bundle) {
          const entry = Object.values(bundle).find((chunk) => chunk.isEntry);
          this.emitFile({
            type: 'asset',
            fileName: 'entry.js',
            source: entry.code,
          });
        },
      },
    ],
  });
  return output.filter(({ source }) => source)[0].source;
}


/**
 * Process single .es6.js file. This function generates the new es5 ready file.
 * @param {Object} config
 */
const processBabelFile = (config) => {
  const {
    file, configuration, events,
  } = config;

  readFile(file, async (err, data) => {
    if (err) throw err;
    const code = await fileRollup((await bablyfy(data.toString(), configuration.browserSupport)));


    let dist = file.replace('.es6', '');
    if (configuration.locations.javascript.dist !== '<source>' && configuration.locations.javascript.dist) {
      if (get(configuration, 'js.babel.keep_path')) {
        const cleanPath = dist.replace(`${config.path}/`, '');
        dist = `${configuration.locations.javascript.dist}${cleanPath.substr(cleanPath.indexOf('/'))}`;
      } else {
        dist = `${configuration.locations.javascript.dist}${dist.substr(dist.lastIndexOf('/'))}`;
      }
    }
    mkdir(dist.substr(0, dist.lastIndexOf('/')), { recursive: true }, (error) => {
      if (error) {
        console.error(error);
        return;
      }
      writeFile(dist, code, () => {
        if (events) {
          events.emit({
            event: 'js:compile',
            path: file,
            properties: {},
          });
        }
      });
    });
  });
};

/**
 * Convert Supplied data to es5 ready js with babel
 * @param {String} data
 * @param {Array, String} browserSupport
 * @returns {String} result
 */
const bablyfy = (data, browserSupport) => babel.transformAsync(data, {
  presets: [
    [require.resolve('babel-preset-airbnb'),
      {
        modules: false,
        targets: {
          browsers: browserSupport || ['> 1%', 'last 2 versions'],
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        helpers: true,
      },
    ],
  ],
});

/**
 * Process all files in the supplied paths
 * @param {Object} config - Object containing all configuration supplied by goat
 */
const processBabel = (config) => {
  const { sources, path } = config;
  sources.forEach((source) => {
    (async (path) => {
      for await (const file of getFiles(path, /\.es6\.js$/gm)) {
        processBabelFile({
          ...config,
          file,
        });
      }
    })(normalize(`${path}/${source}`));
  });
};

module.exports = { processBabel, processBabelFile };
