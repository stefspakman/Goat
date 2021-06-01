import { Goat } from '@the-goat/core';
import getPackages from './getPackages';

const config = {
  goatVersion: '1.5.0',
  functions: [
    '@the-goat/task-styles',
    '@the-goat/task-babel',
    '@the-goat/task-eslint',
    '@the-goat/task-modernizr',
  ],
  modules: [
    {
      name: 'Goat Styles',
      package: '@the-goat/task-styles',
    },
    {
      name: 'Goat Babel',
      package: '@the-goat/task-babel',
    },
    {
      name: 'Goat ESlint',
      package: '@the-goat/task-eslint',
    },
    {
      name: 'Goat Modernizr',
      package: '@the-goat/task-modernizr',
    },
  ],
};

test('Get array of packages', async () => {
  const packages = await getPackages(config);
  expect(Array.isArray(packages)).toBe(true);
  packages.forEach((item) => {
    expect(item instanceof Goat).toBe(true);
  });
});
