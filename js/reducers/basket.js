/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  [id: string]: boolean;
};

function basket(state: State = {}, action: Action): State {
  switch (action.type) {
    case 'PRODUCT_ADDED':
      let added = {};
      added[action.id] = true;
      return {...state, ...added};

    case 'PRODUCT_REMOVED':
      let rest = {...state};
      delete rest[action.id];
      return rest;

    case 'LOGGED_OUT':
      return {};

    case 'RESTORED_BASKET':
      let all = {};
      action.list.forEach((product) => {
        all[product.id] = true;
      });
      return all;
  }
  return state;
}

module.exports = basket;
