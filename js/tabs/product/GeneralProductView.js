/**
 * @flow
 */
'use strict';

var EmptyProduct = require('./EmptyProduct');
var FilterHeader = require('./FilterHeader');
var FilterProducts = require('./filterProducts');
var ListContainer = require('ListContainer');
var Navigator = require('Navigator');
var React = require('React');
var Platform = require('Platform');
var F8DrawerLayout = require('F8DrawerLayout');
var ProductListView = require('./ProductListView');
var FilterScreen = require('../../filter/FilterScreen');

var { connect } = require('react-redux');
var {switchType} = require('../../actions');

import type {Product} from '../../reducers/products';

// TODO: Move from reselect to memoize?
var { createSelector } = require('reselect');

const data = createSelector(
  (store) => store.products,
  (store) => store.filter,
  (products, filter) => FilterProducts.byTopics(products, filter),
);

type Props = {
  filter: any;
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
    (this: any).openFilterScreen = this.openFilterScreen.bind(this);
    (this: any).renderNavigationView = this.renderNavigationView.bind(this);
  }

  render() {
    const filterItem = {
      icon: require('../../common/img/filter.png'),
      title: 'Filter',
      onPress: this.openFilterScreen,
    };

    const filterHeader = Object.keys(this.props.filter).length > 0
      ? <FilterHeader />
      : null;

    const content = (
      <ListContainer
        title="Gifty"
        subTitle="Приложение для покупки/раздариванию подарков. A falsis, hibrida fortis nix. Rise and you will be forgotten purely."
        selectedSegment={this.props.type}
        onSegmentChange={this.switchType}
        backgroundImage={require('./img/schedule-background.png')}
        backgroundColor="#5597B8"
        selectedSectionColor="#51CDDA"
        stickyHeader={filterHeader}
        rightItem={filterItem}>
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
    return (
      <F8DrawerLayout
        ref={(drawer) => { this._drawer = drawer; }}
        drawerWidth={300}
        drawerPosition="right"
        renderNavigationView={this.renderNavigationView}>
        {content}
      </F8DrawerLayout>
    );
  }

  renderNavigationView() {
    return <FilterScreen onClose={() => this._drawer && this._drawer.closeDrawer()} />;
  }

  renderEmptyList(type: string) {
    return (
      <EmptyProduct
        title={`No products for type ${type} that match the filter`}
        text="Check the products for the other types or remove the filter."
      />
    );
  }

  openFilterScreen() {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({ filter: 123 });
    } else {
      this._drawer && this._drawer.openDrawer();
    }
  }

  switchType(type) {
    this.props.switchType(type);
  }
}

function select(store) {
  return {
    day: store.navigation.day,
    filter: store.filter,
    products: data(store),
  };
}

function actions(dispatch) {
  return {
    switchType: (type) => dispatch(switchType(type)),
  };
}

module.exports = connect(select, actions)(GeneralProductView);
