/**
 * @flow
 */

'use strict';

import type { Action } from './types';

type Tab = 'schedule' | 'my-schedule' | 'map' | 'notifications' | 'info' | 'product';

module.exports = {
  switchTab: (tab: Tab): Action => ({
    type: 'SWITCH_TAB',
    tab,
  }),

  switchDay: (day: 1 | 2): Action => ({
    type: 'SWITCH_DAY',
    day,
  }),
  switchType: (productType: 'flower' | 'gift'): Action => ({
    type: 'SWITCH_TYPE',
    productType: productType,
  }),
};
