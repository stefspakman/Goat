const upgrade = require('./upgrade-1-4-0');

test('Get the global config', async () => {
  const beforeConfig = {
    goatVersion: '1.4.0',
    functions: [
      '@the-goat/task-styles',
      '@the-goat/task-babel',
      '@the-goat/task-eslint',
      '@the-goat/task-modernizr',
    ],
  };

  const config = upgrade(beforeConfig);
  expect(typeof config.modules).toBe('object');
  expect(config.goatVersion).toBe(beforeConfig.goatVersion);
  expect(config.modules.length).toBe(beforeConfig.functions.length);
  config.modules.forEach((module) => {
    expect(module).toHaveProperty('name');
    expect(module).toHaveProperty('package');
    expect(beforeConfig.functions.includes(module.package)).toBe(true);
  });
});
