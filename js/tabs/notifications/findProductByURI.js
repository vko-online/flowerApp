/**
 * @providesModule findProductByURI
 * @flow
 */
'use strict';

import type { Product } from '../../reducers/products';

function findProductByURI(products: Array<Product>, uri: ?string): ?Product {
  if (!uri) {
    return null;
  }
  var slug = uri.replace('f8://', '');
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    if (product.slug === slug || product.id === slug) {
      return product;
    }
  }
  return null;
}

module.exports = findProductByURI;
