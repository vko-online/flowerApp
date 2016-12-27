/**
 * @flow
 */
'use strict';

const Parse = require('parse/react-native');
const OrderClass = Parse.Object.extend('Order');

import { ThunkAction, Dispatch } from "./types";
import { Order, PreOrder } from "../reducers/order";
import { Product } from "../reducers/products";

function buyProducts(payload, cb, timeout) {
  console.log('buyProducts', payload);
  setTimeout(() => cb(), timeout || 600);
}

async function tryCheckout(preOrder:PreOrder = {}):ThunkAction {
  return (dispatch:Dispatch) => {
    var newOrder = new OrderClass({
      ...preOrder,
      total: preOrder.products.reduce((total:number, product:Product) => total + product.price, 0),
      userId: Parse.User.current().get('id'),
      status: 'initialized'
    });
    newOrder.save().then(order => {
      console.log('CHECKOUT_SUCCESS', order);
      dispatch({
        type: 'CHECKOUT_SUCCESS',
        id,
      });
      addToHistory(order.id);
    });
  };
}

function addToHistory(id:string):ThunkAction {
  return (dispatch:Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('myHistory').add(new OrderClass({id}));
      Parse.User.current().save();
    }
    dispatch({
      type: 'ADD_TO_HISTORY',
      id,
    });
  };
}

module.exports = {tryCheckout};
