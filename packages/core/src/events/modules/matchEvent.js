/**
 * Check if the current event matches the watched events
 * @param {String} currentEvent
 * @param {RegExp|Array} events
 * @returns {Boolean}
 */
function matchEvent(currentEvent, events) {
  if (events instanceof RegExp) {
    return events.test(currentEvent);
  }
  if (Array.isArray(events)) {
    return events.filter((event) => {
      if (event instanceof RegExp) {
        return event.test(currentEvent);
      }
      return currentEvent === event;
    }).length > 0;
  }
  return currentEvent === events;
}

module.exports = matchEvent;
