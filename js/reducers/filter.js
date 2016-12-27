/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type FriendFilter = {
  id: string;
  name: string;
  favorites: {[key: string]: boolean};
};

export type TopicsFilter = {
  [key: string]: boolean;
};

type State = TopicsFilter;

function filter(state: State = {}, action: Action): State {
  if (action.type === 'APPLY_TOPICS_FILTER') {
    return action.topics;
  }
  if (action.type === 'CLEAR_FILTER') {
    return {};
  }
  return state;
}

module.exports = filter;
