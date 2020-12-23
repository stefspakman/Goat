module.exports = [
  {
    name: 'Compile',
    package: '@geit/compile',
    description: 'Webpack based compiler for Javascript and scss',
    default: true,
  },
  {
    name: 'Goat Styles',
    package: '@geit/styles',
    description: 'A comprehensive task to compile SCSS to CSS',
    default: false,
  },
  {
    name: 'JS Bundler',
    package: '@geit/js-bundler',
    description: 'Compile and bundle js and/or ts',
    default: false,
  },
  {
    name: 'Goat Babel',
    package: '@geit/babel',
    description: 'Compile ES6 code',
    default: false,
  },
  {
    name: 'Goat ESlint',
    package: '@geit/eslint',
    description: 'Lint JS code',
    default: false,
  },
  {
    name: 'Goat Modernizr',
    package: '@geit/modernizr',
    description: 'Generate a custom modernizr file',
    default: false,
  },
  {
    name: 'Styleguide',
    package: '@geit/fractal',
    description: 'Generate and manage a styleguide based on Fractal',
    default: false,
  },
  {
    name: 'Storybook',
    package: '@geit/storybook',
    description: 'Manage a design system using storybook',
    default: false,
  },
];
