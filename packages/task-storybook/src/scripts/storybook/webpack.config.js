module.exports = async ({ config }) => {
  const path = require('path');
  const globImporter = require('node-sass-glob-importer');
  const appRoot = require('app-root-path');
  const goatGonfig = require('../config.js').config;

  const rootDir = goatGonfig.path;

  const namespaces = require('./getNamespaces.js')(goatGonfig);
  // Twig
  config.module.rules.push({
    test: /\.twig$/,
    use: [
      {
        loader: require.resolve('twig-loader'),
        options: {
          twigOptions: {
            namespaces,
          },
        },
      },
    ],
  });

  // SCSS
  const styleResources = goatGonfig.configuration.styles.resources || [];
  const resources = styleResources.map((resource) => path.resolve(goatGonfig.path, resource));
  config.module.rules.push({
    test: /\.s[ac]ss$/i,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          sourceMap: true,
        },
      },
      {
        loader: require.resolve('resolve-url-loader'),
      },
      {
        loader: require.resolve('sass-loader'),
        options: {
          sourceMap: true,
          sassOptions: {
            importer: globImporter(),
          },
        },
      },
      {
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources,
        },
      },
    ],
  });

  // JS
  config.module.rules.push({
    test: /\.js$/,
    exclude: path.resolve(__dirname, '../node_modules'),
    use: [
      require.resolve('babel-loader'),
    ],
  });

  // YAML
  config.module.rules.push({
    test: /\.ya?ml$/,
    loader: require.resolve('js-yaml-loader'),
  });

  // Tell Storybook where your components live
  // eslint-disable-next-line no-param-reassign
  config.resolve.alias.components = path.resolve(rootDir, '/');
  // eslint-disable-next-line no-param-reassign
  config.resolve.alias.Goat = path.resolve(path.join(rootDir, '/.goat'));

  Object.entries(namespaces).forEach(({ 0: key, 1: folderPath }) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias[`@${key}`] = path.resolve(folderPath);
  });

  // eslint-disable-next-line no-param-reassign
  config.resolve.modules = [
    path.resolve(__dirname, '../../node_modules'), // Add this node_modules folder so we don't need twig and other storybook dependencies inside the project
    path.resolve(appRoot.toString(), 'node_modules'), // Add this node_modules folder so we don't need twig and other storybook dependencies inside the project
    'node_modules',
  ];

  // eslint-disable-next-line no-param-reassign
  config.devServer = { stats: 'errors-only' };
  return config;
};
