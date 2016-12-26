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
const Platform = require('Platform');
const InteractionManager = require('InteractionManager');
const ActionSheetIOS = require('ActionSheetIOS');
const Alert = require('Alert');
const ProductClass = Parse.Object.extend('Product');

import { ThunkAction, PromiseAction, Dispatch } from "./types";
import { Product } from "../reducers/products";

function addToFavorites(id: string): ThunkAction {
  return (dispatch: Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('myFavorites').add(new ProductClass({id}));
      Parse.User.current().save();
    }
    dispatch({
      type: 'PRODUCT_ADDED_FAVORITES',
      id,
    });
  };
}

function removeFromFavorites(id: string): ThunkAction {
  return (dispatch: Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('myFavorites').remove(new ProductClass({id}));
      Parse.User.current().save();
    }
    dispatch({
      type: 'PRODUCT_REMOVE_FAVORITES',
      id,
    });
  };
}

function removeFromFavoritesWithPrompt(product: Product): ThunkAction {
  return (dispatch) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Remove From Favorites', 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      }, (buttonIndex) => {
        if (buttonIndex === 0) {
          dispatch(removeFromFavorites(product.id));
        }
      });
    } else {
      Alert.alert(
        'Remove From Your Favorites',
        `Would you like to remove "${product.title}" from your favorites?`,
        [
          {text: 'Cancel'},
          {
            text: 'Remove',
            onPress: () => dispatch(removeFromFavorites(product.id))
          }
        ]
      );
    }
  };
}

async function loadFriendsFavorites(): PromiseAction {
  const list = await Parse.Cloud.run('friends');
  await InteractionManager.runAfterInteractions();
  return {
    type: 'LOADED_FRIENDS_FAVORITES',
    list,
  };
}

async function restoreFavorites():PromiseAction {
  const list = await Parse.User.current().relation('myFavorites').query().find();
  return {
    type: 'RESTORED_FAVORITES',
    list,
  };
}


module.exports = {
  addToFavorites,
  removeFromFavorites,
  removeFromFavoritesWithPrompt,
  loadFriendsFavorites,
  restoreFavorites
};