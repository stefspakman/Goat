import { GoatTask } from '@the-goat/core';

export default () => new GoatTask({
  name: 'Styles',
  command: 'styles',
  description: 'Compile Styles',
  schema: require('./scripts/schema'),
  method: (config) => {
    const sizeReport = require('gulp-sizereport');
    const getSettings = require('./scripts/getSettings');
    const { compileStyles } = require('./scripts/compileStyles');
    const settings = getSettings(config);
    return new Promise((resolve, reject) => {
      const gulpStream = compileStyles({ ...config, settings }).pipe(sizeReport());
      // NOTE: in some cases, gulp 'dies' when no data-event listener is installed?
      gulpStream.on('data', () => {});
      gulpStream.on('end', resolve);
      gulpStream.on('error', reject);
    });
  },
  watch: (config) => {
    const sizeReport = require('gulp-sizereport');
    const getSettings = require('./scripts/getSettings');
    const { compileStyles } = require('./scripts/compileStyles');
    const { events } = config;
    if (!events) {
      throw new Error('Missing Watchable eventemitter');
    }
    const settings = getSettings(config);
    compileStyles({ ...config, settings }).pipe(sizeReport());
    events.watch({
      name: 'Styles',
      pattern: '**/*.s+(a|c)ss',
      events: /file:/,
      method: () => {
        compileStyles({ ...config, settings }).pipe(sizeReport());
      },
    });
  },
});
