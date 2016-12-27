/**
 * @flow
 */

'use strict';

const Parse = require('parse/react-native');
const {AppEventsLogger} = require('react-native-fbsdk');
const Platform = require('Platform');
const InteractionManager = require('InteractionManager');
const ActionSheetIOS = require('ActionSheetIOS');
const Alert = require('Alert');
const Share = require('react-native-share');

import { ThunkAction} from "./types";
import { Product } from "../reducers/products";

function setSharingEnabled(enabled:boolean):ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'SET_SHARING_PRODUCT',
      enabled,
    });
    Parse.User.current().set('sharedProduct', enabled);
    Parse.User.current().save();
  };
}

function shareProduct(product:Product):ThunkAction {
  return (dispatch, getState) => {
    const {productURLTemplate} = getState().config;
    const url = productURLTemplate
      .replace('{id}', product.id);

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions({
        message: product.title,
        url,
      }, (e) => console.error(e), logShare.bind(null, product.id));
    } else {
      Share.open({
        share_text: product.title,
        share_URL: url,
        title: 'Share Link to ' + product.title,
      }, (e) => logShare(product.id, true, null));
    }
  };
}

function logShare(id, completed, activity) {
  AppEventsLogger.logEvent('Share Product', 1, {id});
  Parse.Analytics.track('shareProduct', {
    id,
    completed: completed ? 'yes' : 'no',
    activity: activity || '?'
  });
}

module.exports = {
  shareProduct,
  setSharingEnabled
};