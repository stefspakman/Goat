import { Goat } from '@the-goat/core';
import loadModule from './loadModule';

test('Load a module', () => {
  const modules = [
    { name: 'Goat Styles', package: '@the-goat/task-styles' },
    { name: 'Goat Babel', package: '@the-goat/task-babel' },
    { name: 'Goat ESlint', package: '@the-goat/task-eslint' },
  ];

  modules.forEach((ref) => {
    const module = loadModule(ref);
    expect(typeof module).toBe('function');
    const result = module(Goat);
    expect(result instanceof Goat).toBe(true);
  });
});
