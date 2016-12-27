/**
 * @providesModule F8BasketProductCell
 * @flow
 */

'use strict';
import Icon from 'react-native-vector-icons/FontAwesome';
var F8Colors = require('F8Colors');
var React = require('React');
var StyleSheet = require('StyleSheet');
var {Text} = require('F8Text');
var TouchableOpacity = require('TouchableOpacity');
var View = require('View');

var {connect} = require('react-redux');
var {
  removeFromBasketWithPrompt
} = require('../../actions');
import { Product } from "../../reducers/products";

class F8BasketProductCell extends React.Component {
  props:{
    product: Product;
    style: any;
  };

  constructor(props) {
    super(props);

    (this: any).onPress = this.onPress.bind(this);
  }

  render() {
    var product = this.props.product;
    var priceColor = F8Colors.colorForPrice(product.price);
    return (
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
        <TouchableOpacity onPress={this.onPress} accessibilityTraits="button" style={styles.action}>
          <Icon name="times" size={30} color="#a1a1a1"/>
        </TouchableOpacity>
      </View>
    )
  }

  onPress() {
    this.props.dispatch(removeFromBasketWithPrompt(this.props.product));
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
  action: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 20,
    top: 20,
  }
});

module.exports = connect()(F8BasketProductCell);
