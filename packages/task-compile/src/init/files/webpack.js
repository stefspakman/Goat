module.exports.webpack = (config) => {
  return config;
};

module.exports.transform = {
  lodash: {
    transform: 'lodash/${member}',
    preventFullImport: true,
  },
};
