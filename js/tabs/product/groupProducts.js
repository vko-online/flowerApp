/**
 * @flow
 */
'use strict';

import type {Product} from '../../reducers/products';


export type ProductsListData = {
  [subType: string]: {
    [productID: string]: Product;
  };
};

function groupProducts(products: Array<Product>): ProductsListData {
  var data = {};
  products.forEach((product) => {
    var subTypeSectionKey = product.subType;
    data[subTypeSectionKey] = data[subTypeSectionKey] || {};
    data[subTypeSectionKey][product.id] = product;
  });

  return data;
}

module.exports = groupProducts;
