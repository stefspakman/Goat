/* eslint-disable class-methods-use-this */
import clipboardy from 'clipboardy';
import style, { Kleur } from 'kleur';
import boxen from 'boxen';

/**
 * Goat's Notification services
 */
class Notifier {
  public style: Kleur;

  constructor() {
    this.style = style;
  }

  /**
   * Basic logging functionality
   */
  public log(text: string) {
    console.log(text);
  }

  /**
   * Inform user about something (hopefully interesting)
   * @param {String} text - value to inform about
   * @memberof Notifier
   */
  info(text: string) {
    this.log('');
    this.log(
      boxen(text, {
        padding: {
          top: 0,
          bottom: 0,
          left: 1,
          right: 1,
        },
        dimBorder: true,
        float: 'left',
      }),
    );
    this.log('');
  }

  /**
   * Error event logging
   */
  error(error: string | { messageFormatted: string }) {
    if (typeof error === 'string') {
      console.error(style.bold().red(error));
      return;
    }
    if (error.messageFormatted) {
      console.error(style.bold().red(error.messageFormatted));
    }
  }

  /**
   * Write console messages on a single line.
   */
  singleLine(text: string) {
    const single = require('single-line-log').stdout;
    single(text);
  }

  /**
   * Get an emoji by name
   */
  emoji(emoji: string) {
    const { get: getEmoji } = require('node-emoji');
    return getEmoji(emoji);
  }

  /**
   * Format a command to log and copy to clipboard for use
   * @param {String} content
   * @returns {String}
   * @memberof Notifier
   */
  script(content: string) {
    clipboardy.writeSync(content);
    return this.style.black().italic().bgYellow(` ${content} `);
  }
}

const notify = new Notifier();

export default notify;
