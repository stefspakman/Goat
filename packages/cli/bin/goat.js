#!/usr/bin/env node

require('../dist/index').default().catch((err) => {
  console.log(err);
  process.exit(1);
});
