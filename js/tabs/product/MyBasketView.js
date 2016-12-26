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

var EmptyProduct = require('./EmptyProduct');
var F8Button = require('F8Button');
var FilterProducts = require('./filterProducts');
var ListContainer = require('ListContainer');
var LoginButton = require('../../common/LoginButton');
var Navigator = require('Navigator');
var ProfilePicture = require('../../common/ProfilePicture');
var React = require('React');
var PureListView = require('../../common/PureListView');
var ProductPlainListView = require('./ProductPlainListView');
var FriendsListView = require('./FriendsListView');
var BasketListView = require('./BasketListView');

var { connect } = require('react-redux');

var {
  logOutWithPrompt,
  switchTab,
  switchType,
  loadFriendsFavorites,
} = require('../../actions');

import type {Product} from '../../reducers/products';
import type {FriendsFavorites} from '../../reducers/friendsFavorites';
import type {State as User} from '../../reducers/user';

var { createSelector } = require('reselect');

type Props = {
  user: User;
  products: Array<Product>;
  basket: Array<Product>;
  purchaseHistory: Array<Product>;
  friends: Array<FriendsFavorites>;
  favorites: {[key:string]: boolean}[];
  navigator: Navigator;
  logOut: () => void;
  onJumpToType: (type: string) => void;
  loadFriendsFavorites: () => void;
};

// TODO: Rename to MyF8View
class MyBasketView extends React.Component {
  props: Props;

  constructor(props) {
    super(props);

    (this: any).renderEmptyProductsList = this.renderEmptyProductsList.bind(this);
    (this: any).openSharingSettings = this.openSharingSettings.bind(this);
    (this: any).handleSegmentChanged = this.handleSegmentChanged.bind(this);
  }

  render() {
    var rightItem;
    if (this.props.user.isLoggedIn) {
      rightItem = {
        title: 'Settings',
        icon: require('./img/settings.png'),
        onPress: this.openSharingSettings,
      };
    }

    const {id, isLoggedIn} = this.props.user;
    const profilePicture = isLoggedIn && id
      ? <ProfilePicture userID={id} size={100} />
      : null;

    return (
      <ListContainer
        title="Gifty"
        parallaxContent={profilePicture}
        backgroundImage={require('./img/my-f8-background.png')}
        backgroundColor={'#A8D769'}
        onSegmentChange={this.handleSegmentChanged}
        rightItem={rightItem}>
        {this.renderContent()}
      </ListContainer>
    );
  }

  renderContent() {
    if (!this.props.user.isLoggedIn) {
      return (
        <PureListView
          renderEmptyList={this.renderNotLoggedIn}
        />
      );
    }

    return [
      <BasketListView
        title="Basket"
        products={this.props.basket}
        renderEmptyList={this.renderEmptyProductsList}
        navigator={this.props.navigator}
      />,
      <ProductPlainListView
        title="History"
        products={this.props.purchaseHistory}
        renderEmptyList={this.renderEmptyHistory}
        navigator={this.props.navigator}
      />,
      <FriendsListView
        title="Friends"
        friends={this.props.friends}
        navigator={this.props.navigator}
      />,
    ];
  }

  renderNotLoggedIn() {
    return (
      <EmptyProduct
        key="login"
        title="Log in to make a schedule."
        text="You’ll be able to save products to your favorites to view or share later.">
        <LoginButton source="My F8" />
      </EmptyProduct>
    );
  }

  renderEmptyHistory() {
    return (
      <EmptyProduct
        key="history"
        image={require('./img/no-sessions-added.png')}
        text={'No products purchased yet'}>
      </EmptyProduct>
    );
  }

  renderEmptyProductsList() {
    return (
      <EmptyProduct
        key="product"
        image={require('./img/no-sessions-added.png')}
        text={'Products you want to buy will\nappear here.'}>
      </EmptyProduct>
    );
  }

  openSharingSettings() {
    this.props.navigator.push({shareSettings: 1});
  }

  handleSegmentChanged(segment) {
    if (segment === 2 /* friends */) {
      this.props.loadFriendsFavorites();
    }
  }
}

const data = createSelector(
  (store) => store.products,
  (store) => store.favorites,
  (products, favorites) => FilterProducts.byFavorites(products, favorites),
);

function select(store) {
  return {
    user: store.user,
    products: data(store),
    favorites: store.favorites,
    basket: store.basket,
    purchaseHistory: store.history,
    // Only show friends who have something in their favorites
    friends: store.friendsFavorites.filter(
      (friend) => Object.keys(friend.favorites).length > 0
    ),
  };
}

function actions(dispatch) {
  return {
    logOut: () => dispatch(logOutWithPrompt()),
    jumpToType: (type) => dispatch([
      switchTab('basket'),
      switchType(type)
    ]),
    loadFriendsFavorites: () => dispatch(loadFriendsFavorites()),
  };
}

module.exports = connect(select, actions)(MyBasketView);
