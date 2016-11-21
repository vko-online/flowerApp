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
 * @providesModule F8ProductDetails
 */

'use strict';

var Animated = require('Animated');
var F8Colors = require('F8Colors');
var Image = require('Image');
var Dimensions = require('Dimensions');
var PixelRatio = require('PixelRatio');
var React = require('React');
var ScrollView = require('ScrollView');
var StyleSheet = require('StyleSheet');
var Subscribable = require('Subscribable');
var {Text} = require('F8Text');
var TouchableOpacity = require('TouchableOpacity');
var View = require('View');
var AddToBasketButton = require('./AddToBasketButton');
var {WIDTH} = Dimensions.get('window');

var {connect} = require('react-redux');
var {addToBasket, removeFromBasketWithPrompt} = require('../../actions');

var F8ProductDetails = React.createClass({
  mixins: [Subscribable.Mixin],

  getInitialState: function() {
    return {
      scrollTop: new Animated.Value(0),
    };
  },

  render: function() {

    var priceColor = F8Colors.colorForPrice(this.props.product.price);
    var productPrice = this.props.product.price;
    var discount = this.props.product.discount;
    var discountItem = discount ? <Text style={styles.discount}>{'скидка ' + discount + '%'}</Text> : null;
    var price = (
      <Text style={[styles.price, {color: priceColor}]}>
        {productPrice + ' тенге' }
      </Text>
    );

    var title = this.props.product.title || '';

    return (
      <View style={[styles.container, this.props.style]}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          onScroll={({nativeEvent}) => this.state.scrollTop.setValue(nativeEvent.contentOffset.y)}
          scrollEventThrottle={100}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}>
          {price}
          {discountItem}
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.description}>
            {this.props.product.description}
          </Text>
          <Image style={styles.picture} source={{uri: this.props.product.image}}/>
          <TouchableOpacity
            accessibilityLabel="Share this product"
            accessibilityTraits="button"
              onPress={this.props.onShare}
            style={styles.shareButton}>
            <Image source={require('./img/share.png')} />
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.actions}>
          <AddToBasketButton
            isAdded={false}
            onPress={this.toggleAdded}
          />
        </View>
        <Animated.View style={[
          styles.miniHeader,
          {
            opacity: this.state.scrollTop.interpolate({
              inputRange: [0, 150, 200],
              outputRange: [0, 0, 1],
              extrapolate: 'clamp',
            })
          }
        ]}>
          <Text numberOfLines={1} style={styles.miniTitle}>
            {title}
          </Text>
          {price}
        </Animated.View>
      </View>
    );
  },

  toggleAdded: function() {
    if (this.props.isAddedToBasket) {
      this.props.removeFromBasketWithPrompt();
    } else {
      this.addToBasket();
    }
  },

  addToBasket: function() {
    if (!this.props.isLoggedIn) {
      this.props.navigator.push({
        login: true, // TODO: Proper route
        callback: this.addToBasket,
      });
    } else {
      this.props.addToBasket();
      if (this.props.sharedSchedule === null) {
        setTimeout(() => this.props.navigator.push({share: true}), 1000);
      }
    }
  },
});

var PADDING = 15;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 26,
    paddingBottom: 60,
  },
  miniHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 12,
    top: 0,
    right: 12,
    paddingVertical: 9,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#E1E1E1',
  },
  miniTitle: {
    fontSize: 12,
    flex: 1,
    color: F8Colors.darkText,
  },
  price: {
    fontSize: 12,
  },
  discount: {
    fontSize: 15,
    color: F8Colors.darkText
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -1,
    lineHeight: 32,
    marginVertical: 20,
  },
  priceDescription: {
    color: F8Colors.lightText,
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    lineHeight: 25,
  },
  topics: {
    fontSize: 12,
    color: F8Colors.lightText,
  },
  section: {
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  sectionTitle: {
    color: F8Colors.lightText,
    marginRight: 14,
    fontSize: 12,
  },
  line: {
    height: 1 / PixelRatio.get(),
    backgroundColor: F8Colors.lightText,
    flex: 1,
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    margin: 10,
    paddingVertical: 10,
    borderTopColor: '#eeeeee',
    backgroundColor: 'white',
  },
  shareButton: {
    backgroundColor: 'transparent',
    padding: PADDING,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  picture: {
    width: WIDTH,
    height: 200
  }
});

function select(store, props) {
  return {
    isAddedToBasket: !!store.basket[props.product.id],
    isLoggedIn: store.user.isLoggedIn,
    sharedProduct: store.user.sharedProduct,
    productURLTemplate: store.config.productURLTemplate,
  };
}

function actions(dispatch, props) {
  let id = props.product.id;
  return {
    addToBasket: () => dispatch(addToBasket(id)),
    removeFromBasketWithPrompt:
      () => dispatch(removeFromBasketWithPrompt(props.product)),
  };
}

module.exports = connect(select, actions)(F8ProductDetails);
