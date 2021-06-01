import { parse } from 'path';
import Notifier from '../notifier';
import matchPattern from './modules/matchPattern';
import matchEvent from './modules/matchEvent';
import eventMessage from './modules/eventMessage';

// @ts-ignore
// eslint-disable-next-line
const EventEmitter: any = require('events').EventEmitter;

/**
 * Execute callback event based on event data
 * @returns
 */
function handleEvent(callback: any, data: any) {
  if (
    !data.event
    || (callback.pattern && !matchPattern(data.path, callback.pattern))
    || !matchEvent(data.event, callback.events)
  ) {
    return;
  }
  Notifier.log(Notifier.style.cyan(`\tRunning ${callback.name || 'unnamed task'}`));
  callback.method(data);
}

/**
 * Custom event handler for goat packages
 */

class GoatEvents extends EventEmitter {
  emit(args:any) {
    const parameters = {
      ...args,
    };
    if (args.path) {
      parameters.extension = parse(args.path).ext;
    }
    if (!parameters.silent) {
      eventMessage(args.event, args.path);
    }
    super.emit('goat', parameters);
  }

  watch(callback = {}) {
    super.on('goat', (data:any) => {
      if (!Array.isArray(callback)) {
        handleEvent(callback, data);
        return;
      }
      callback.forEach((item) => {
        handleEvent(item, data);
      });
    });
  }

  // @ts-ignore
  // eslint-disable-next-line
  get on() {
    return undefined;
  }
}

export default GoatEvents;
