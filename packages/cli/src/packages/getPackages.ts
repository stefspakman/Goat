import { GoatTask, IGoatInternalProjectConfig } from '@the-goat/core';
import loadModule from '../methods/modules/loadModule';

/**
 * Collect modules
 */
export default async function getModules({ modules }: IGoatInternalProjectConfig):Promise<GoatTask[]> {
  return (
    modules
      // @ts-ignore
      .flatMap((item) => {
        const module = loadModule(item);
        if (Array.isArray(module)) {
          return module.map((task) => task(GoatTask));
        }
        return module();
      })
      .filter((item:any) => !!item)
  );
}
