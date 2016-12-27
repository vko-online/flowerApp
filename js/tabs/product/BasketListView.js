/**
 * @flow
 */
'use strict';

var F8BasketProductCell = require('F8BasketProductCell');
var Navigator = require('Navigator');
var React = require('React');
var PureListView = require('../../common/PureListView');

import type {Product} from '../../reducers/products';

type Props = {
  products: Array<Product>;
  navigator: Navigator;
  renderEmptyList?: (type: string) => ReactElement;
};

type State = {
  todayProducts: Array<Product>;
};

class BasketListView extends React.Component {
  props: Props;
  state: State;
  _innerRef: ?PureListView;

  constructor(props: Props) {
    super(props);


    this.state = {
      todayProducts: props.products,
    };

    this._innerRef = null;

    (this: any).renderSectionHeader = this.renderSectionHeader.bind(this);
    (this: any).renderRow = this.renderRow.bind(this);
    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
    (this: any).storeInnerRef = this.storeInnerRef.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.products !== this.props.products) {
      this.setState({
        todayProducts: nextProps.products
      });
    }
  }

  render() {
    return (
      <PureListView
        ref={this.storeInnerRef}
        data={this.state.todayProducts}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        {...(this.props: any /* flow can't guarantee the shape of props */)}
        renderEmptyList={this.renderEmptyList}
      />
    );
  }

  renderSectionHeader() {
    return null;
  }

  renderRow(product: Product) {
    return (
      <F8BasketProductCell
        product={product}
      />
    );
  }

  renderEmptyList(): ?ReactElement {
    const {renderEmptyList} = this.props;
    return renderEmptyList && renderEmptyList(this.props.day);
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }

  scrollTo(...args: Array<any>) {
    this._innerRef && this._innerRef.scrollTo(...args);
  }

  getScrollResponder(): any {
    return this._innerRef && this._innerRef.getScrollResponder();
  }
}

module.exports = BasketListView;
