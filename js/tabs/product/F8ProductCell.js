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
 * @providesModule F8ProductCell
 * @flow
 */

'use strict';

var F8Colors = require('F8Colors');
var Image = require('Image');
var React = require('React');
var StyleSheet = require('StyleSheet');
var { Text } = require('F8Text');
var F8Touchable = require('F8Touchable');
var View = require('View');

import type {Product} from '../../reducers/products';

class F8ProductCell extends React.Component {
  props: {
    product: Product;
    onPress: ?() => void;
    style: any;
  };

  render() {
    var product = this.props.product;
    var priceColor = F8Colors.colorForPrice(product.price);
    var cell =
      <View style={[styles.cell, this.props.style]}>
        <View style={styles.titleProduct}>
          <Text numberOfLines={2} style={styles.titleText}>
            {product.title}
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.description}>
          <Text style={[styles.priceText, {color: priceColor}]}>
            {product.price + ' тг'}
          </Text>
          {product.price && ' - '}
          {product.subTitle}
        </Text>
      </View>;

    if (this.props.onPress) {
      cell =
        <F8Touchable onPress={this.props.onPress}>
          {cell}
        </F8Touchable>;
    }

    return cell;
  }
}


var styles = StyleSheet.create({
  cell: {
    paddingVertical: 15,
    paddingLeft: 17,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  titleProduct: {
    paddingRight: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAndDuration: {
    justifyContent: 'center',
  },
  titleText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    color: F8Colors.darkText,
    marginBottom: 4,
    marginRight: 10,
  },
  description: {
    fontSize: 12,
    color: F8Colors.lightText,
  },
  priceText: {
    fontSize: 12,
  },
  added: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 0,
    top: 0,
  },
});

module.exports = F8ProductCell;
