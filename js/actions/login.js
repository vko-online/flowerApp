/**
 * @flow
 */

'use strict';

const Parse = require('parse/react-native');
const FacebookSDK = require('FacebookSDK');
const ActionSheetIOS = require('ActionSheetIOS');
const {Platform} = require('react-native');
const Alert = require('Alert');
const {
  restoreSchedule,
  loadFriendsSchedules,
} = require('./schedule');
const {
  restoreFavorites,
  loadFriendsFavorites
} = require('./favorites');
const {
  restoreHistory
} = require('./history');
const {
  restoreBasket
} = require('./basket');
const {updateInstallation} = require('./installation');
const {loadSurveys} = require('./surveys');

import { Action, ThunkAction } from "./types";

async function ParseFacebookLogin(scope):Promise {
  return new Promise((resolve, reject) => {
    Parse.FacebookUtils.logIn(scope, {
      success: resolve,
      error: (user, error) => reject(error && error.error || error),
    });
  });
}

async function queryFacebookAPI(path, ...args):Promise {
  return new Promise((resolve, reject) => {
    FacebookSDK.api(path, ...args, (response) => {
      if (response && !response.error) {
        resolve(response);
      } else {
        reject(response && response.error);
      }
    });
  });
}

async function _logInWithFacebook(source:?string):Promise<Array<Action>> {
  await ParseFacebookLogin('public_profile,email,user_friends');
  const profile = await queryFacebookAPI('/me', {fields: 'name,email'});

  const user = await Parse.User.currentAsync();
  user.set('facebook_id', profile.id);
  user.set('name', profile.name);
  user.set('email', profile.email);
  await user.save();
  await updateInstallation({user});

  const action = {
    type: 'LOGGED_IN',
    source,
    data: {
      id: profile.id,
      name: profile.name,
      sharedSchedule: user.get('sharedSchedule'),
      sharedProduct: user.get('sharedProduct'),
    },
  };

  return Promise.all([
    Promise.resolve(action),
    restoreSchedule(),
    restoreFavorites(),
    restoreHistory(),
    restoreBasket()
  ]);
}

function logInWithFacebook(source:?string):ThunkAction {
  return (dispatch) => {
    const login = _logInWithFacebook(source);

    // Loading friends schedules shouldn't block the login process
    login.then(
      (result) => {
        dispatch(result);
        dispatch(loadFriendsSchedules());
        dispatch(loadFriendsFavorites());
        dispatch(loadSurveys());
      }
    );
    return login;
  };
}

function skipLogin():Action {
  return {
    type: 'SKIPPED_LOGIN',
  };
}

function logOut():ThunkAction {
  return (dispatch) => {
    Parse.User.logOut();
    FacebookSDK.logout();
    updateInstallation({user: null, channels: []});

    // TODO: Make sure reducers clear their state
    return dispatch({
      type: 'LOGGED_OUT',
    });
  };
}

function logOutWithPrompt():ThunkAction {
  return (dispatch, getState) => {
    let name = getState().user.name || 'there';

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: `Hi, ${name}`,
          options: ['Log out', 'Cancel'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            dispatch(logOut());
          }
        }
      );
    } else {
      Alert.alert(
        `Hi, ${name}`,
        'Log out from F8?',
        [
          {text: 'Cancel'},
          {text: 'Log out', onPress: () => dispatch(logOut())},
        ]
      );
    }
  };
}

module.exports = {logInWithFacebook, skipLogin, logOut, logOutWithPrompt};
