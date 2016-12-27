/**
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

var { connect } = require('react-redux');

import type {Product} from '../../reducers/products';

class F8ProductCell extends React.Component {
  props: {
    product: Product;
    showTick: boolean;
    hideTickForce?: boolean;
    onPress: ?() => void;
    style: any;
  };

  render() {
    console.log('this.props.showTick', this.props.showTick);
    console.log('this.props.hideTickForce', this.props.hideTickForce);
    var product = this.props.product;
    var tick;
    if (this.props.showTick && !this.props.hideTickForce) {
      console.log('called');
      tick =
        <Image style={styles.added} source={require('./img/added-cell.png')} />;
    }
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
        {tick}
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

function select(store, props) {
  console.log('store.favorites', store.favorites);
  return {
    showTick: !!store.favorites[props.product.id],
  };
}

module.exports = connect(select)(F8ProductCell);
