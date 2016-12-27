/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  [id: string]: boolean;
};

function favorites(state: State = {}, action: Action): State {
  switch (action.type) {
    case 'PRODUCT_ADDED_FAVORITES':
      console.log('PRODUCT_ADDED_FAVORITES', action.id);
      let added = {};
      added[action.id] = true;
      return {...state, ...added};

    case 'PRODUCT_REMOVE_FAVORITES':
      let rest = {...state};
      delete rest[action.id];
      return rest;

    case 'LOGGED_OUT':
      return {};

    case 'RESTORED_FAVORITES':
      let all = {};
      action.list.forEach((product) => {
        all[product.id] = true;
      });
      return all;
  }
  return state;
}

module.exports = favorites;
