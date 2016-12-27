/**
 * @flow
 */

'use strict';

import { Action } from "../actions/types";

export type State = {
  isLoggedIn: boolean;
  hasSkippedLogin: boolean;
  sharedProduct: ?boolean;
  id: ?string;
  name: ?string;
};

const initialState = {
  isLoggedIn: false,
  hasSkippedLogin: false,
  sharedProduct: null,
  id: null,
  name: null,
};

function user(state:State = initialState, action:Action):State {
  if (action.type === 'LOGGED_IN') {
    let {id, name, sharedProduct} = action.data;
    if (sharedProduct === undefined) {
      sharedProduct = null;
    }
    return {
      isLoggedIn: true,
      hasSkippedLogin: false,
      sharedProduct,
      id,
      name,
    };
  }
  if (action.type === 'SKIPPED_LOGIN') {
    return {
      isLoggedIn: false,
      hasSkippedLogin: true,
      sharedProduct: null,
      id: null,
      name: null,
    };
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }
  if (action.type === 'SET_SHARING_PRODUCT') {
    return {
      ...state,
      sharedProduct: action.enabled,
    };
  }
  if (action.type === 'RESET_NUXES') {
    return {...state, sharedProduct: null};
  }
  return state;
}

module.exports = user;
