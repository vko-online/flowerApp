/**
 * @flow
 */

'use strict';

const Parse = require('parse/react-native');
const InteractionManager = require('InteractionManager');

import type { Action } from './types';

async function loadConfig(): Promise<Action> {
  const config = await Parse.Config.get();
  await InteractionManager.runAfterInteractions();
  return {
    type: 'LOADED_CONFIG',
    config,
  };
}

module.exports = {loadConfig};
