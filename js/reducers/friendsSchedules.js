/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type FriendsSchedule = {
  id: string;
  name: string;
  schedule: {[key: string]: boolean};
};

type State = Array<FriendsSchedule>;

function friendsSchedules(state: State = [], action: Action): State {
  if (action.type === 'LOADED_FRIENDS_SCHEDULES') {
    return action.list;
  }
  if (action.type === 'LOGGED_OUT') {
    return [];
  }
  return state;
}

module.exports = friendsSchedules;
