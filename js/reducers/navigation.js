/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type Tab =
    'schedule'
  | 'my-schedule'
  | 'map'
  | 'notifications'
  | 'info'
  | 'product'
  ;

export type Day = 1 | 2;

export type ProductType = 'flower' | 'gift';

type State = {
  tab: Tab;
  day: Day;
  type: ProductType
};

const initialState: State = { tab: 'schedule', day: 1 };

function navigation(state: State = initialState, action: Action): State {
  if (action.type === 'SWITCH_TAB') {
    return {...state, tab: action.tab};
  }
  if (action.type === 'SWITCH_DAY') {
    return {...state, day: action.day};
  }
  if (action.type === 'SWITCH_TYPE') {
    return {...state, type: action.productType};
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }
  return state;
}

module.exports = navigation;
