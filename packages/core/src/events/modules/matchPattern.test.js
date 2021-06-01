const matchPattern = require('./matchPattern');

test.each`
file    | pattern    | expected
  ${'/c/www/goat/goat-examples/components/test.js'} | ${'**/*.s+(a|c)ss'} | ${false}
  ${'/c/www/goat/goat-examples/components/test.js'} | ${'**/*.js'} | ${true}
  ${'/c/www/goat/goat-examples/components/test.js'} | ${['**/*.es6.js']} | ${false}
  ${'/c/www/goat/goat-examples/components/test.es6.js'} | ${['**/*.es6.js']} | ${true}
`('returns $expected when $file matches $pattern', ({ file, pattern, expected }) => {
  expect(matchPattern(file, pattern)).toBe(expected);
});
