const ejs = require('ejs');
const prettier = require('prettier');

const prettierSettings = {
  semi: true,
  singleQuote: true,
  'html-whitespace-sensitivity': 'ignore',
};

/**
 * Write given content to file
 * @param {String} file
 * @param {*} content
 */
function writeFile(file, content) {
  const { writeFileSync, mkdir } = require('fs');
  const getDirName = require('path').dirname;
  mkdir(getDirName(file), { recursive: true }, (err) => {
    if (err) {
      return;
    }
    writeFileSync(file, content);
  });
}

/**
 * generate hash from iconlist
 * @param {object} files
 * @returns {string}
 */
function generateHash(files) {
  const shortHash = require('short-hash');
  return shortHash(JSON.stringify(files.src));
}

/**
 * Format CSS based of unicode characters
 * @param {Object} options
 * @param {Object} files
 * @returns {String}
 */
async function createCSS(options, files) {
  const css = Object.entries(files.unicode).map(({ 0: name, 1: code }) => {
    const unicodeString = code.charCodeAt(0).toString(16);
    return `.${options.classNamePrefix}-${name}::before { content: "\\${unicodeString}"; }\n`;
  }).join('');

  const template = require.resolve('../../templates/styles.scss');

  const file = await ejs.renderFile(template, {
    styles: css,
    classNamePrefix: options.classNamePrefix,
    fontName: options.fontName,
    hash: generateHash(files),
    path: options.fontDirectory || '.',
    generate: options.generate,
  });
  return prettier.format(file, {
    ...prettierSettings,
    parser: 'css',
  });
}

/**
 * Format Styles file
 * @param {Object} options
 * @param {Object} files
 * @returns {Promise<String>}
 */
async function createStyles(options, files) {
  const scss = Object.entries(files.unicode).map(({ 0: name, 1: code }) => {
    const scssVariable = `$${options.classNamePrefix}-${name}`;
    return `.${options.classNamePrefix}-${name}::before { content: ${scssVariable}; }\n`;
  }).join('');

  const template = require.resolve('../../templates/styles.scss');
  const file = await ejs.renderFile(template, {
    styles: scss,
    classNamePrefix: options.classNamePrefix,
    fontName: options.fontName,
    hash: generateHash(files),
    path: `#{$${options.classNamePrefix}-font-path}`,
    generate: options.generate,
  });
  return prettier.format(file, {
    ...prettierSettings,
    parser: 'scss',
  });
}

/**
 * Format SCSS Variables based of unicode characters
 * @param {Object} options
 * @param {Object} files
 * @returns {String}
 */
async function createVariablesScss(options, files) {
  const variables = Object.entries(files.unicode).map(({ 0: name, 1: code }) => {
    const unicodeString = code.charCodeAt(0).toString(16);
    const scssVariable = `$${options.classNamePrefix}-${name}`;
    return `${scssVariable}: "\\${unicodeString}";\n`;
  }).join('');

  const template = require.resolve('../../templates/variables.scss');
  const file = await ejs.renderFile(template, {
    variables,
    path: options.fontDirectory,
    classNamePrefix: options.classNamePrefix,
  });
  return prettier.format(file, {
    ...prettierSettings,
    parser: 'scss',
  });
}

/**
 * Format SCSS Mixins file
 * @param {Object} options
 * @param {Object} files
 * @returns {String}
 */
async function createMixinsScss(options) {
  const template = require.resolve('../../templates/mixins.scss');
  const file = await ejs.renderFile(template, {
    fontName: options.fontName,
    classNamePrefix: options.classNamePrefix,
  });
  return prettier.format(file, {
    ...prettierSettings,
    parser: 'scss',
  });
}

/**
 * Create a html preview page for the icons
 * @param {Object} options
 * @param {Object} files
 * @returns {Promise<String>}
 */
async function createPreview(options, files) {
  const lines = Object.keys(files.unicode).map((name) => `<li class="class-icon"><span class="${options.classNamePrefix}-${name}"></span><p class="name">${name}</p></li>`).join('');
  const template = require.resolve('../../templates/icons.html');
  const settings = {
    ...options,
    title: options.fontName,
    css: files.css,
    fontName: options.fontName,
    classNamePrefix: options.classNamePrefix,
    html: lines,
    cssFileName: options.styles.filename,
  };
  const file = await ejs.renderFile(template, settings);
  return prettier.format(file, {
    ...prettierSettings,
    parser: 'html',
  });
}

/**
 * Generate JSON file which can be used by other programs and tools to show the available icons
 * @param {Object} options
 * @param {Object} files
 * @returns {Object}
 */
function createJson(options, files) {
  const symbols = files.symbol.split('</symbol>').reduce((result, symbol) => {
    const title = symbol.match(/(?<=(<title>)).*(?=(<\/title>))/);
    const paths = [...symbol.matchAll(/<path[\s\S].*\/>/gm)].map((path) => path[0].match(/(?<=(d=")).*(?=("\/>))/)[0]);
    if (!paths.length || !title) {
      return result;
    }
    // eslint-disable-next-line no-param-reassign
    result[title[0]] = paths;
    return result;
  }, {});
  return Object.entries(files.unicode).reduce((result, { 0: key, 1: unicode }) => {
    result.icons.push({
      label: key,
      path: symbols[key],
      unicode: `${unicode.charCodeAt(0).toString(16)}`,
      variable: `$${options.classNamePrefix}-${key}`,
      class: `.${options.classNamePrefix}-${key}`,
    });
    return result;
  }, {
    icons: [],
  });
}

/**
 * Generate Icomoon selection.json file
 * @param {Object} options
 * @param {Object} files
 * @returns {Promise<String>}
 */
async function createSelectionJson(options, files) {
  const icons = files.json.icons.map((icon, index) => ({
    icon: {
      paths: [
        icon.path,
      ],
      attrs: [
        {},
      ],
      isMulticolor: false,
      isMulticolor2: false,
      tags: [
        icon.label,
      ],
      grid: 32,
    },
    attrs: [
      {},
    ],
    properties: {
      order: index + 1,
      id: index + 1,
      name: icon.label,
      prevSize: 24,
      code: parseInt(icon.unicode, 16),
    },
    setIdx: 0,
    setId: 0,
    iconIdx: index + 1,
  }));
  const template = require.resolve('../../templates/selection.json');
  const selection = await ejs.renderFile(template, {
    icons: JSON.stringify(icons),
    prefix: options.classNamePrefix,
    fontName: options.fontName,
  });
  return JSON.parse(await selection);
}

/**
 * Convert TTF to EOT
 * @param {Object} options
 * @param {Object} files
 * @returns {Buffer}
 */
function createEOT(options, files) {
  const ttf2eot = require('ttf2eot');
  return Buffer.from(ttf2eot(files.ttf).buffer);
}

/**
 * Convert TTF to WOFF
 * @param {Object} options
 * @param {Object} files
 * @returns {Buffer}
 */
function createWOFF(options, files) {
  const ttf2woff = require('ttf2woff');
  return Buffer.from(ttf2woff(files.ttf).buffer);
}

/**
 * Convert TTF to WOFF2
 * @param {Object} options
 * @param {Object} files
 * @returns {Buffer}
 */
function createWOFF2(options, files) {
  const ttf2woff2 = require('ttf2woff2');
  return Buffer.from(ttf2woff2(files.ttf).buffer);
}

/**
 * Convert svg font to ttf buffer
 * @param {Object} options
 * @param {Object} files
 * @returns {Buffer}
 */
function createTTF(options, files) {
  const svg2ttf = require('svg2ttf');
  // eslint-disable-next-line no-param-reassign
  options.svg2ttf = options.svg2ttf || {};
  const ttf = svg2ttf(files.svg.toString(), options.svg2ttf);
  return Buffer.from(ttf.buffer);
}

/**
 * Collect array of available source files
 * @param {Object} options
 * @returns {{path: string, name: string}[]}
 */
function getSourceFiles(options) {
  const { join, extname, basename } = require('path');
  const { readdirSync } = require('fs');
  const files = readdirSync(options.src, 'utf-8');
  if (!files) {
    throw new Error(`Error! Svg folder is empty.${options.src}`);
  }
  const filter = files.filter((file) => !(typeof file !== 'string' || extname(file) !== '.svg'));
  return filter.map((file) => ({
    name: basename(file, '.svg'),
    path: join(options.src, file),
  }));
}

/**
 * Extract unicode definition
 * @param {Object} options
 * @param {Object} files
 * @returns {Object}
 */
function getUnicode(options, files) {
  let { startUnicode } = options;
  return files.src.reduce((result, file) => {
    const unicode = String.fromCharCode(startUnicode += 1);
    // eslint-disable-next-line no-param-reassign
    result[file.name] = unicode;
    return result;
  }, {});
}

/**
 * Create a single file from multiple svg's
 * @param {Object} options
 * @param {Object} files
 * @returns {Promise<Buffer>}
 */
function createSVG(options, files) {
  const getStream = require('get-stream');
  const { createReadStream } = require('fs');
  const SVGIcons2SVGFont = require('svgicons2svgfont');

  const stream = new SVGIcons2SVGFont({
    ...options.svgicons2svgfont,
  });

  files.src.forEach((file) => {
    const glyph = createReadStream(file.path);
    glyph.metadata = { unicode: [files.unicode[file.name]], name: file.name };
    stream.write(glyph);
  });

  stream.end();
  return getStream.buffer(stream);
}

/**
 * Get Symbol data
 * @param {Object} options
 * @param {Object} files
 * @returns {Promise<Object>}
 */
async function createSvgSymbol(options, files) {
  const { basename, extname } = require('path');
  const { readFileSync } = require('fs');
  const symbols = files.src.map((svgPath) => {
    const fileName = basename(svgPath.path, extname(svgPath.path));
    const file = readFileSync(svgPath.path, 'utf8');
    const contents = file.match(/(?<=(<svg.*">)).*(?=(<\/svg>))/s)[0];
    return `<symbol id="${options.classNamePrefix}-${fileName}">${contents}</symbol>`;
  }).join('');

  const template = require.resolve('../../templates/symbol.svg');
  const file = await ejs.renderFile(template, {
    icons: symbols,
  });
  return prettier.format(file, {
    ...prettierSettings,
    parser: 'html',
  });
}

function getFontPath(options) {
  if (options.fontDirectory) {
    return `${options.dist}/${options.fontDirectory}`;
  }
  return options.dist;
}

/**
 * Write data to files
 * @param {Object} options
 * @param {Object} files
 */
function writeFiles(options, files) {
  const { normalize } = require('path');
  const fontDirectory = getFontPath(options);
  const write = {
    woff: () => writeFile(normalize(`${fontDirectory}/${options.fontName}.woff`), files.woff),
    eot: () => writeFile(normalize(`${fontDirectory}/${options.fontName}.eot`), files.eot),
    ttf: () => writeFile(normalize(`${fontDirectory}/${options.fontName}.ttf`), files.ttf),
    woff2: () => writeFile(normalize(`${fontDirectory}/${options.fontName}.woff2`), files.woff2),
    preview: () => writeFile(normalize(`${options.dist}/${options.fontName}.html`), files.preview),
    json: () => writeFile(normalize(`${options.dist}/${options.fontName}.json`), JSON.stringify(files.json, null, 2)),
    variables: () => writeFile(normalize(`${options.dist}/variables.scss`), files.variables),
    mixins: () => writeFile(normalize(`${options.dist}/mixins.scss`), files.mixins),
    css: () => writeFile(normalize(`${options.dist}/${options.styles.filename}.css`), files.css),
    styles: () => writeFile(normalize(`${options.dist}/${options.styles.filename}.scss`), files.styles),
    selection: () => writeFile(normalize(`${options.dist}/selection.json`), JSON.stringify(files.selection, null, 2)),
    svg: () => writeFile(normalize(`${fontDirectory}/${options.fontName}.svg`), files.svg),
    symbol: () => writeFile(normalize(`${fontDirectory}/${options.fontName}.symbol.svg`), files.symbol),
  };

  Object.entries(write).forEach(({ 0: type, 1: method }) => {
    if (!options.generate[type]) {
      return;
    }
    method();
  });
}

/**
 * Generate the icon font
 * @param options
 * @returns {Promise<void>}
 */
async function generateIconfont(options) {
  const files = {};
  files.src = getSourceFiles(options);
  files.unicode = getUnicode(options, files); // Source => Unicode
  files.svg = await createSVG(options, files); // Source => SVG
  files.symbol = await createSvgSymbol(options, files); // Source => Symbol SVG
  files.ttf = await createTTF(options, files); // SVG Font => TTF
  files.woff = await createWOFF(options, files); // TTF => WOFF
  files.eot = await createEOT(options, files); // TTF => EOT
  files.woff2 = await createWOFF2(options, files); // TTF => WOFF2
  files.json = createJson(options, files); // Symbol SVG => JSON
  files.selection = await createSelectionJson(options, files); // JSON => Selection
  files.variables = await createVariablesScss(options, files); // Unicode => Variables
  files.mixins = await createMixinsScss(options); // Options => Mixins
  files.css = await createCSS(options, files); // Unicode => CSS
  files.styles = await createStyles(options, files); // Unicode => Styles
  files.preview = await createPreview(options, files); // Unicode => Preview

  writeFiles(options, files);
}

/**
 * Generate the option object
 * @param {object} config
 * @param {string} [source]
 * @param {string} [dist]
 * @param {string} [name]
 * @returns {{fontName: (*|string), classNamePrefix: (*|string), src: *, fontDirectory: string, dist: *, styles: {filename}, startUnicode: number, svgicons2svgfont: {fontHeight: number, normalize: boolean}, generate: {preview, symbol, variables, css, selection, svg, ttf, json, woff2, styles, eot, woff}}}
 */
function getOptions(config, source, dist, name) {
  const get = require('lodash/get');
  return {
    src: source || config.configuration.locations.icons.src,
    dist: dist || config.configuration.locations.icons.dist,
    fontName: name || get(config, 'configuration.icons.fontName') || 'icons',
    startUnicode: 0xea01,
    classNamePrefix: name || get(config, 'configuration.icons.prefix') || 'icon',
    svgicons2svgfont: {
      fontHeight: 1000,
      normalize: true,
    },
    fontDirectory: get(config, 'configuration.icons.fontDirectory') || 'fonts',
    generate: {
      woff: get(config, 'configuration.icons.generate.woff'),
      eot: get(config, 'configuration.icons.generate.eot'),
      ttf: get(config, 'configuration.icons.generate.ttf'),
      woff2: get(config, 'configuration.icons.generate.woff2'),
      preview: get(config, 'configuration.icons.generate.preview'),
      json: get(config, 'configuration.icons.generate.json'),
      variables: get(config, 'configuration.icons.generate.variables'),
      mixins: get(config, 'configuration.icons.generate.mixins'),
      css: get(config, 'configuration.icons.generate.css'),
      styles: get(config, 'configuration.icons.generate.styles'),
      selection: get(config, 'configuration.icons.generate.selection'),
      svg: get(config, 'configuration.icons.generate.svg'),
      symbol: get(config, 'configuration.icons.generate.symbol'),
    },
    styles: {
      filename: get(config, 'configuration.icons.styles.filename'),
    },
  };
}

/**
 * Generate all defined icon fonts
 * @param {object} config
 * @return Promise
 */
function runAll(config) {
  const { readdirSync } = require('fs');
  const { join } = require('path');

  const getDirectories = (source) => readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const directories = getDirectories(config.configuration.locations.icons.src);
  if (directories.length) {
    return Promise.all(directories.map((directory) => {
      const options = getOptions(
        config,
        join(config.configuration.locations.icons.src, directory),
        join(config.configuration.locations.icons.dist, directory),
        directory,
      );
      return generateIconfont(options)
        .then(() => console.info(`Set ${directory} generated`))
        .catch((error) => console.error(error));
    }));
  }
  const options = getOptions(config);
  return generateIconfont(options)
    .then(() => console.info('Set generated'));
}

/**
 * Generate single icon set based of single filePath
 * @param {object} config
 * @param {string} icon
 */
function runSingle(config, icon) {
  const { dirname, basename, join } = require('path');
  const source = dirname(icon);
  const set = basename(source);
  const options = getOptions(
    config,
    source,
    join(config.configuration.locations.icons.dist, set),
    set,
  );
  generateIconfont(options)
    .then(() => console.info(`Set ${set} generated`))
    .catch((error) => console.error(error));
}

module.exports = {
  runAll,
  runSingle,
};
