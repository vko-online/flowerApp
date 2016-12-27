/**
 * @flow
 */

'use strict';

const createParseReducer = require('./createParseReducer');
import type {Product} from './products';

export type Order = {
  id: string;
  userId: string;
  products: Array<Product>;
  total: number;
  fullName: string;
  address: string;
  deliveryDate: number;
  phone: string;
  notes: string;
  status: string;
};

export type PreOrder = {
  products: Array<Product>;
  address: string;
  deliveryDate: number;
  phone: string;
  notes: string;
}

function fromParseOrders(order: Object): Order {
  return {
    id: order.id,
    userId: order.get('userId'),
    products: order.get('products'),
    total: order.get('total'),
    fullName: order.get('fullName'),
    address: order.get('address'),
    deliveryDate: order.get('deliveryDate'),
    phone: order.get('phone'),
    notes: order.get('notes'),
    status: order.get('status')
  };
}

module.exports = createParseReducer('LOADED_ORDERS', fromParseOrders);
