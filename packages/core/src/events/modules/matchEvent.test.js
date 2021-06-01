const matchEvent = require('./matchEvent');

test.each`
currentEvent    | events    | expected
  ${'file:change'} | ${/file:/} | ${true}
  ${'file:change'} | ${[/file:/]} | ${true}
  ${'file:change'} | ${'file:change'} | ${true}
  ${'file:change'} | ${['file:change']} | ${true}
  ${'js:lint'} | ${/file:/} | ${false}
  ${'js:lint'} | ${[/file:/]} | ${false}
  ${'js:lint'} | ${'file:change'} | ${false}
  ${'js:lint'} | ${['file:change']} | ${false}
  ${'js:lint'} | ${[]} | ${false}
  ${'js:lint'} | ${null} | ${false}
`('returns $expected when event: $currentEvent matches $events', ({ currentEvent, events, expected }) => {
  expect(matchEvent(currentEvent, events)).toBe(expected);
});
