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

var Navigator = require('Navigator');
var ProfilePicture = require('../../common/ProfilePicture');
var React = require('React');
var EmptyProduct = require('./EmptyProduct');
var FilterProducts = require('./filterProducts');
var ListContainer = require('ListContainer');
var ProductListView = require('./ProductListView');

var { connect } = require('react-redux');

import type {Product} from '../../reducers/products';
import type {FriendsFavorites} from '../../reducers/friendsFavorites';

var { createSelector } = require('reselect');

type Props = {
  products: Array<Product>;
  friend: FriendsFavorites;
  navigator: Navigator;
};

class FriendsFavoriteView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
  }

  render() {
    const backItem = {
      icon: require('../../common/img/back_white.png'),
      onPress: () => this.props.navigator.pop(),
    };
    const firstName = this.props.friend.name.split(' ')[0];
    return (
      <ListContainer
        title={`${firstName}'s Favorites`}
        parallaxContent={<ProfilePicture userID={this.props.friend.id} size={100} />}
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor={'#5597B8'}
        selectedSectionColor="#51CDDA"
        leftItem={backItem}>
        <ProductListView
          title="Цветы"
          type="flower"
          products={this.props.products}
          renderEmptyList={this.renderEmptyList}
          navigator={this.props.navigator}
        />
        <ProductListView
          title="Подарки"
          type="gift"
          products={this.props.products}
          renderEmptyList={this.renderEmptyList}
          navigator={this.props.navigator}
        />
      </ListContainer>
    );
  }

  renderEmptyList(type) {
    return (
      <EmptyProduct
        title="Nothing to show."
        text={`${this.props.friend.name} has not added any products of ${type}`}
      />
    );
  }
}

const data = createSelector(
  (store) => store.products,
  (store, props) => props.friend.favorites,
  (products, favorites) => FilterProducts.byFavorites(products, favorites),
);

function select(store, props) {
  return {
    products: data(store, props),
  };
}

module.exports = connect(select)(FriendsFavoriteView);
