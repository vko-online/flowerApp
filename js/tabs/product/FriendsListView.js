/**
 * @flow
 */
'use strict';

var EmptyProduct = require('./EmptyProduct');
var Navigator = require('Navigator');
var React = require('React');
var ProductsSectionHeader = require('./ProductsSectionHeader');
var InviteFriendsButton = require('./InviteFriendsButton');
var PureListView = require('../../common/PureListView');
var FriendCell = require('./FriendCell');

type Friend = any;

type Props = {
  friends: Array<Friend>;
  navigator: Navigator;
};

class FriendsListView extends React.Component {
  props: Props;
  _innerRef: ?PureListView;

  constructor(props: Props) {
    super(props);

    this._innerRef = null;

    (this: any).renderSectionHeader = this.renderSectionHeader.bind(this);
    (this: any).renderRow = this.renderRow.bind(this);
    (this: any).renderFooter = this.renderFooter.bind(this);
    (this: any).renderEmptyList = this.renderEmptyList.bind(this);
    (this: any).storeInnerRef = this.storeInnerRef.bind(this);
  }

  render() {
    return (
      <PureListView
        ref={this.storeInnerRef}
        data={this.props.friends}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
        renderEmptyList={this.renderEmptyList}
        renderFooter={this.renderFooter}
        {...(this.props: any /* flow can't guarantee the shape of props */)}
      />
    );
  }

  renderSectionHeader() {
    return <ProductsSectionHeader title="See a friend's favorites" />;
  }

  renderRow(friend: Friend) {
    return (
      <FriendCell
        friend={friend}
        onPress={() => this.openFriendsFavorites(friend)}
      />
    );
  }

  renderEmptyList(): ?ReactElement {
    return (
      <EmptyProduct
        image={require('./img/no-friends-found.png')}
        text={'Friends using the F8 app\nwill appear here.'}>
        <InviteFriendsButton />
      </EmptyProduct>
    );
  }

  renderFooter() {
    return <InviteFriendsButton style={{margin: 20}} />;
  }

  openFriendsFavorites(friend: Friend) {
    this.props.navigator.push({friend});
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

module.exports = FriendsListView;
