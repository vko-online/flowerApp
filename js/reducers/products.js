/**
 * @flow
 */

'use strict';

const createParseReducer = require('./createParseReducer');

export type Product = {
  id: string;
  title: string;
  subTitle: string;
  description: string;
  type: string;
  subType: string;
  price: number;
  discount: number;
  image: string;
  images: Array<string>;
  tags: Array<string>
};

function fromParseProducts(product: Object): Product {
  return {
    id: product.id,
    title: product.get('title'),
    subTitle: product.get('subTitle'),
    description: product.get('description'),
    type: product.get('type'),
    subType: product.get('subType'),
    price: product.get('price'),
    discount: product.get('discount'),
    image: product.get('image') && product.get('image').url(),
    images: product.get('images'),
    tags: product.get('tags'),
  };
}

module.exports = createParseReducer('LOADED_PRODUCTS', fromParseProducts);
