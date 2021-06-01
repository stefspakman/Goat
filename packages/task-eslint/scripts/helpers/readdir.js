const { resolve } = require('path');
const { readdir } = require('fs').promises;

async function* getFiles(dir, extension) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res, extension);
    } 
    else {
      if (res.match(extension)) {
        yield res;
      } else {
        continue;
      }
    }
  }
}

module.exports = getFiles;
