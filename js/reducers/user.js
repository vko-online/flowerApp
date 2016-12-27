/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type State = {
  isLoggedIn: boolean;
  hasSkippedLogin: boolean;
  sharedSchedule: ?boolean;
  sharedProduct: ?boolean;
  id: ?string;
  name: ?string;
};

const initialState = {
  isLoggedIn: false,
  hasSkippedLogin: false,
  sharedSchedule: null,
  sharedProduct: null,
  id: null,
  name: null,
};

function user(state: State = initialState, action: Action): State {
  if (action.type === 'LOGGED_IN') {
    let {id, name, sharedSchedule, sharedProduct} = action.data;
    if (sharedSchedule === undefined) {
      sharedSchedule = null;
    }
    if(sharedProduct === undefined) {
      sharedProduct = null;
    }
    return {
      isLoggedIn: true,
      hasSkippedLogin: false,
      sharedSchedule,
      sharedProduct,
      id,
      name,
    };
  }
  if (action.type === 'SKIPPED_LOGIN') {
    return {
      isLoggedIn: false,
      hasSkippedLogin: true,
      sharedSchedule: null,
      sharedProduct: null,
      id: null,
      name: null,
    };
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }
  if (action.type === 'SET_SHARING') {
    return {
      ...state,
      sharedSchedule: action.enabled,
    };
  }
  if (action.type === 'SET_SHARING_PRODUCT') {
    return {
      ...state,
      sharedProduct: action.enabled,
    };
  }
  if (action.type === 'RESET_NUXES') {
    return {...state, sharedSchedule: null, sharedProduct: null};
  }
  return state;
}

module.exports = user;
