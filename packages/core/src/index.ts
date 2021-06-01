import GoatTask, { TGoatTaskMethodConfig } from './GoatTask';
import watch from './events/watch';
import goatConfig from './config/goatConfig';
import { IGoatInternalProjectConfig, IGoatExternalProjectConfig } from './config';
import GoatEvents from './events/GoatEvents';
import notify from './notifier';
import generateConfig from './schemas/generateConfig';

export {
  GoatTask,
  generateConfig,
  goatConfig,
  notify,
  watch,
  GoatEvents,
  TGoatTaskMethodConfig,
  IGoatInternalProjectConfig,
  IGoatExternalProjectConfig,
};
