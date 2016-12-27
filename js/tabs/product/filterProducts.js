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
