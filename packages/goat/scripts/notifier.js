const style = require('kleur');
const single = require('single-line-log').stdout;

/**
 * Goat's Notification services
 * @class Notifier
 */
class Notifier {  
  constructor() {
    this.style = style;
  }

  /**
   * Basic logging functionality
   * @param {String} text - Value to log
   * @memberof Notifier
   */
  log(text) {
    console.log(text);    
  }

  /**
   * Inform user about something (hopefully interesting)
   * @param {String} text - value to inform about
   * @memberof Notifier
   */
  info(text) {
    console.info(text);    
  }

  /**
   * Error event logging
   * @param {String, Object} error
   * @memberof Notifier
   */
  error(error) {
    if (error.messageFormatted) {
      console.error(style.bold().red(error.messageFormatted));
      return
    }
    console.error(style.bold().red(error));
  }

  /**
   * Write console messages on a single line.
   * @param {String} text
   * @memberof Notifier
   */
  singleLine(text) {
    single(text);
  }
}

module.exports = Notifier;