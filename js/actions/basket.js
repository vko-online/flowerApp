/**
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
