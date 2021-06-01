import { notify as Notifier } from '@the-goat/core';

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const compass = require('compass-importer');
const filter = require('gulp-filter');
const flatten = require('gulp-flatten');
const multiDest = require('gulp-multi-dest');
const postcss = require('gulp-postcss');
const pxToRem = require('postcss-pxtorem');
const sass = require('gulp-dart-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const aliasImporter = require('node-sass-alias-importer');

/**
 * Process scss files using gulp-sass
 * @param {Object} {
 *   configuration,
 *   settings,
 * }
 * @returns {Object} stream - Returns a gulp stream
 */
const compileStyles = ({
  configuration,
  settings,
}) => {
  settings.dest = typeof settings.dest === 'string' ? [settings.dest] : settings.dest;
  let stream = gulp.src(settings.source);
  stream = stream
    .pipe(filter(['**/*', '!**/+*.scss', '!**/~*.scss'], {
      restore: false,
    }))
    .pipe(filter(() => configuration.styles.exclude.unshift('**/*'), {
      restore: false,
    }))
    .pipe(sassGlob({
      ignorePaths: settings.ignore,
    }));

  if (configuration.styles.sourceMaps.generate) {
    stream = stream
      .pipe(sourcemaps.init({
        loadMaps: configuration.styles.sourceMaps.loadMaps,
        identityMap: configuration.styles.sourceMaps.identityMap,
        debug: configuration.styles.sourceMaps.debug,
      }));
  }

  stream = stream
    .pipe(sass({
      outputStyle: configuration.styles.minify ? 'compressed' : 'expanded',
      importer: [
        configuration.locations.node_modules ? aliasImporter({
          '~': configuration.locations.node_modules,
        }) : null,
        configuration.styles.compass ? compass : null,
      ],
    }).on('error', Notifier.error))
    .pipe(autoprefixer({
      overrideBrowserslist: configuration.browserSupport,
      cascade: false,
    }));

  if (configuration.styles.pxToRem.enabled) {
    stream = stream
      .pipe(postcss([
        pxToRem(configuration.styles.pxToRem.settings),
      ]));
  }

  if (configuration.styles.sourceMaps.generate) {
    stream = stream
      .pipe(sourcemaps.write(configuration.styles.sourceMaps.location, {
        sourceRoot: (file) => `${'../'.repeat(file.relative.split('\\').length)}src`,
        addComment: configuration.styles.sourceMaps.addComment,
        includeContent: configuration.styles.sourceMaps.includeContent,
        destPath: configuration.styles.sourceMaps.destPath,
        sourceMappingURLPrefix: configuration.styles.sourceMaps.sourceMappingUrlPrefix,
        debug: configuration.styles.sourceMaps.debug,
        charset: configuration.styles.sourceMaps.charset,
      }));
  }

  stream = stream
    .pipe(flatten())
    .pipe(multiDest(settings.dest))
    .pipe(filter(['**/*', '!**/*.map'], {
      restore: false,
    }));

  return stream;
};

module.exports = { compileStyles };
