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

var F8ProductCell = require('F8ProductCell');
var FilterProducts = require('./filterProducts');
var Navigator = require('Navigator');
var React = require('React');
var ProductsSectionHeader = require('./ProductsSectionHeader');
var PureListView = require('../../common/PureListView');
var groupProducts = require('./groupProducts');

import type {Product} from '../../reducers/products';
import type {ProductsListData} from './groupProducts';

type Props = {
  type: string;
  products: Array<Product>;
  navigator: Navigator;
  renderEmptyList?: (day: number) => ReactElement;
};

type State = {
  todayProducts: ProductsListData;
};

class ProductListView extends React.Component {
  props: Props;
  state: State;
  _innerRef: ?PureListView;

  constructor(props: Props) {
    super(props);
    this.state = {
      todayProducts: groupProducts(FilterProducts.byType(props.products, props.type)),
    };

    this._innerRef = null;

    (this: any).renderSectionHeader = this.renderSectionHeader.bind(this);
    (this: any).renderRow = this.renderRow.bind(this);
    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
    (this: any).storeInnerRef = this.storeInnerRef.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.products !== this.props.products ||
        nextProps.type !== this.props.type) {
      this.setState({
        todayProducts: groupProducts(FilterProducts.byType(this.props.products, this.props.type)),
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

  renderSectionHeader(sectionData: any, sectionID: string) {
    return <ProductsSectionHeader title={sectionID} />;
  }

  renderRow(product: Product, type: string) {
    return (
      <F8ProductCell
        onPress={() => this.openProduct(product, type)}
        product={product}
      />
    );
  }

  renderEmptyList(): ?ReactElement {
    const {renderEmptyList} = this.props;
    return renderEmptyList && renderEmptyList(this.props.type);
  }

  openProduct(product: Product, type: string) {
    this.props.navigator.push({
      type,
      product,
      allProducts: this.state.todayProducts,
    });
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

module.exports = ProductListView;
