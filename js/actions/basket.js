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

function addToBasket(id:string):ThunkAction {
  return (dispatch:Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('myBasket').add(new ProductClass({id}));
      Parse.User.current().save();
    }
    dispatch({
      type: 'PRODUCT_ADDED',
      id,
    });
  };
}

function removeFromBasket(id:string):ThunkAction {
  return (dispatch:Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('myBasket').remove(new ProductClass({id}));
      Parse.User.current().save();
    }
    dispatch({
      type: 'PRODUCT_REMOVED',
      id,
    });
  };
}

function removeFromBasketWithPrompt(product:Product):ThunkAction {
  return (dispatch) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Remove From Basket', 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      }, (buttonIndex) => {
        if (buttonIndex === 0) {
          dispatch(removeFromBasket(product.id));
        }
      });
    } else {
      Alert.alert(
        'Remove From Your Basket',
        `Would you like to remove "${product.title}" from your basket?`,
        [
          {text: 'Cancel'},
          {
            text: 'Remove',
            onPress: () => dispatch(removeFromBasket(product.id))
          }
        ]
      );
    }
  };
}

async function restoreBasket():PromiseAction {
  const list = await Parse.User.current().relation('myBasket').query().find();
  return {
    type: 'RESTORED_BASKET',
    list,
  };
}


module.exports = {
  addToBasket,
  removeFromBasket,
  restoreBasket,
  removeFromBasketWithPrompt,
};
