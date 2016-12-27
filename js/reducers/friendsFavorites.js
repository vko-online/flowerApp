/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type FriendsFavorites = {
  id: string;
  name: string;
  favorites: {[key: string]: boolean};
};

type State = Array<FriendsFavorites>;

function friendsFavorites(state: State = [], action: Action): State {
  if (action.type === 'LOADED_FRIENDS_FAVORITES') {
    return action.list;
  }
  if (action.type === 'LOGGED_OUT') {
    return [];
  }
  return state;
}

module.exports = friendsFavorites;
