import { addDecorator } from '@storybook/html';
import { useEffect } from '@storybook/client-api';
// eslint-disable-next-line import/no-unresolved
import Twig from 'twig';
import { setupTwig } from './setupTwig';

// If in a Drupal project, it's recommended to import a symlinked version of drupal.js.
import './_drupal';
// eslint-disable-next-line import/extensions
import 'Goat/preview.js'; // import preview.js from .goat project folder;

// addDecorator deprecated, but not sure how to use this otherwise.
addDecorator((storyFn) => {
  // eslint-disable-next-line no-undef
  useEffect(() => Drupal.attachBehaviors(), []);
  return storyFn();
});

setupTwig(Twig);
