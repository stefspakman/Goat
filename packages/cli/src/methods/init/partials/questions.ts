import { notify as Notifier } from '@the-goat/core';
import inquirer from 'inquirer';
import modulesPromise from '../../modules/collectModules';

/**
 * Inquire the user preferences.
 * @returns {Object} answers
 */
export default async function initQuestions() {
  const modules = await modulesPromise;
  const questions = [
    {
      type: 'input',
      name: 'project_name',
      message: "What's the name of your project ? ",
      default: () => {
        const path = process.cwd();
        return path.substring(
          path.lastIndexOf('\\') > -1 ? path.lastIndexOf('\\') : path.lastIndexOf('/') + 1,
        );
      },
    },
    {
      type: 'checkbox',
      message: `Select modules\n${Notifier.style.reset(
        `${Notifier.emoji('goat')} are build-in Goat commands`,
      )}\n`,
      name: 'project_packages',
      choices: modules.map((item) => {
        const name = !item.global ? `${item.name} ${Notifier.emoji('goat')}` : item.name;
        const line = item.description ? `${name} | ${item.description}` : name;
        return {
          ...item,
          name: line,
          value: item,
        };
      }),
      default: () => modules
        .map((item) => {
          if (!item.default) {
            return null;
          }
          return item;
        })
        .filter((item) => item !== null),
    },
  ];

  return inquirer.prompt(questions);
}
