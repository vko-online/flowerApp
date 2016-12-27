/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';
import type {Product} from './products';

function history(state: Array<Product> = [], action: Action): Array<Product> {
  switch (action.type) {
    case 'RESTORED_HISTORY':
      return [...action.list];

    case 'LOGGED_OUT':
      return [];
  }
  return state;
}

module.exports = history;
