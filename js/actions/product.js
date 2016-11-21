/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
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

import { ThunkAction } from "./types";
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
  setSharingEnabled,
};