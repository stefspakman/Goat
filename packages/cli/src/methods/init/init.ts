import { notify as Notifier } from '@the-goat/core';
import { promises } from 'fs';
import { normalize } from 'path';
import initQuestions from './partials/questions';
import initializeGoatConfig from './partials/initConfig';
import initializeProjectConfig from './partials/projectConfig';
import getPackageInitialisation from './partials/getPackageInitialisation';
import packageFiles from './partials/packageFiles';

const { stat } = promises;

/**
 * Initialize Goat inside the current folder, this is the entry point of this command.
 */
const action = async (options?: { reset?: boolean }) => {
  const init = async () => {
    const answers = await initQuestions();
    // write (empty) placeholder file to make GoatTasks initialze without problems
    await promises.writeFile('goat.config.json', JSON.stringify({ version: '2.x' }));
    const initSettings = getPackageInitialisation(answers.project_packages);
    initializeGoatConfig(answers);
    initializeProjectConfig(answers, initSettings);
    packageFiles(initSettings as any);
  };
  if (options && options.reset) {
    init();
    return;
  }

  try {
    await stat(normalize('./goat.config.json'));
    Notifier.log('Goat is already initialized');
    return;
  } catch (error) {
    init();
  }
};

module.exports = action;
