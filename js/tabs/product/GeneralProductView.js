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
var ListContainer = require('ListContainer');
var Navigator = require('Navigator');
var React = require('React');
var Platform = require('Platform');
var F8DrawerLayout = require('F8DrawerLayout');
var ProductListView = require('./ProductListView');

var { connect } = require('react-redux');
var {switchType} = require('../../actions');

import type {Product} from '../../reducers/products';

// TODO: Move from reselect to memoize?
var { createSelector } = require('reselect');

const data = createSelector(
  (store) => store.products,
  (products) => products, //filtering
);

type Props = {
  type: string;
  products: Array<Product>;
  navigator: Navigator;
  logOut: () => void;
  switchType: (type: string) => void;
};

class GeneralProductView extends React.Component {
  props: Props;
  _drawer: ?F8DrawerLayout;

  constructor(props) {
    super(props);

    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
    (this: any).switchType = this.switchType.bind(this);
    (this: any).renderNavigationView = this.renderNavigationView.bind(this);
  }

  render() {

    const content = (
      <ListContainer
        title="Gifty"
        selectedSegment={0}
        onSegmentChange={this.switchType}
        backgroundImage={require('./img/flower-gift.jpg')}
        backgroundColor="#5597B8"
        selectedSectionColor="#51CDDA"
        stickyHeader={null}>
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

    if (Platform.OS === 'ios') {
      return content;
    }
  }

  renderNavigationView() {
    return null;
  }

  renderEmptyList(type: string) {
    return (
      <EmptyProduct
        title={`No products on type ${type} match the filter`}
        text="Check the product for the other type or remove the filter."
      />
    );
  }

  switchType(page) {
    var type = page === 0 ? 'gift' : 'product';
    this.props.switchType(type);
  }
}

function select(store) {
  return {
    type: store.navigation.type,
    products: data(store),
  };
}

function actions(dispatch) {
  return {
    switchType: (type) => dispatch(switchType(type)),
  };
}

module.exports = connect(select, actions)(GeneralProductView);
