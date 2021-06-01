/**
 * Collect commands defined by the modules
 */
import { GoatTask } from '@the-goat/core';

async function CollectCommands(packages: GoatTask[]) {
  return packages.map((module) => module.getCommand());
}

export default CollectCommands;
