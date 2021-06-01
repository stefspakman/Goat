import { IGoatInternalProjectConfig } from '@the-goat/core';

const modules: IGoatInternalProjectConfig['modules'] = [
  {
    name: 'Compile',
    package: '@the-goat/task-compile',
    description: 'Webpack based compiler for Javascript and scss',
    default: true,
  },
  {
    name: 'Goat Styles',
    package: '@the-goat/task-styles',
    description: 'A comprehensive task to compile SCSS to CSS',
    default: false,
  },
  {
    name: 'JS Bundler',
    package: '@the-goat/task-js-bundler',
    description: 'Compile and bundle js and/or ts',
    default: false,
  },
  {
    name: 'Goat Babel',
    package: '@the-goat/task-babel',
    description: 'Compile ES6 code',
    default: false,
  },
  {
    name: 'Goat ESlint',
    package: '@the-goat/task-eslint',
    description: 'Lint JS code',
    default: false,
  },
  {
    name: 'Goat Modernizr',
    package: '@the-goat/task-modernizr',
    description: 'Generate a custom modernizr file',
    default: false,
  },
  {
    name: 'Storybook',
    package: '@the-goat/task-storybook',
    description: 'Manage a design system using storybook',
    default: false,
  },
  {
    name: 'Icons',
    package: '@the-goat/task-icons',
    description: 'Generate icon font files based on svg files',
    default: false,
  },
];

export default modules;
