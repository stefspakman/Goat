import { readFileSync } from 'fs';
import { join } from 'path';

export default {
  files: [
    {
      name: 'preview.js',
      destination: '.goat/',
      data: readFileSync(join(__dirname, './files/preview.js'), 'utf8'),
    },
  ],
};
