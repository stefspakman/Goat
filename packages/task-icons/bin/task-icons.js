#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [nodeBin, runScript, sourceFolder, destinationFolder] = process.argv;

if (!sourceFolder || !destinationFolder) {
  console.log(`Usage:\n\n${runScript} <source_folder> <destination_folder>`);
  process.exit(0);
}

require('../dist/index')
  .method({
    configuration: {
      locations: {
        icons: {
          src: sourceFolder,
          dist: destinationFolder,
        },
      },
    },
  })
  .then(() => {
    console.log('Task finished');
  });
