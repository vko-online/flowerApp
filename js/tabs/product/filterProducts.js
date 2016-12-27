/**
 * @flow
 */
'use strict';

import type {Product} from '../../reducers/products';

type StringMap = {[key: string]: boolean};

function byType(products: Array<Product>, type: string): Array<Product> {
  return products.filter((product) => product.type === type);
}

function byTopics(products: Array<Product>, topics: StringMap): Array<Product> {
  if (Object.keys(topics).length === 0) {
    return products;
  }
  console.log('products', products);
  return products.filter((product) => {
    var hasMatchingTag = false;
    if (product.tags && product.tags.length) {
      product.tags.forEach((tag) => {
        hasMatchingTag = hasMatchingTag || topics[tag];
      });
    }
    return hasMatchingTag;
  });
}

function byFavorites(products: Array<Product>, favorites: StringMap): Array<Product> {
  return products.filter(
    (product) => favorites[product.id]
  );
}

module.exports = {byType, byTopics, byFavorites};
