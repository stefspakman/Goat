/**
 * Execute webpack config
 * @param {Object} config
 */
import { TGoatTaskMethodConfig } from '@the-goat/core';
// @ts-ignore
import server from '@storybook/core/server';
import serverOptions from '@storybook/html/dist/server/options';
import goatGonfig from '../config';

export default function runStory(config: TGoatTaskMethodConfig) {
  // @ts-ignore
  goatGonfig.config = config;
  server.buildDevStandalone({
    ...serverOptions,
    configDir: __dirname,
    port: 6006,
    ci: true,
  });
}
