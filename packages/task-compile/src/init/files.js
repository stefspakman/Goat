const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = {
  files: [
    {
      name: 'webpack.js',
      destination: '.goat/',
      data: readFileSync(join(__dirname, './files/webpack.js'), 'utf8'),
    },
  ],
};
