/**
 * @flow
 */
'use strict';

var F8Colors = require('F8Colors');
var F8ProductCell = require('F8ProductCell');
var React = require('React');
var StyleSheet = require('StyleSheet');
var findProductByURI = require('findProductByURI');
var { Text } = require('F8Text');
var TouchableHighlight = require('TouchableHighlight');
var View = require('View');
var moment = require('moment');

var { connect } = require('react-redux');

class NotificationCell extends React.Component {
  render() {
    var attachment;
    if (this.props.product) {
      attachment = (
        <F8ProductCell
          style={styles.product}
          product={this.props.product}
        />
      );
    } else if (this.props.notification.url) {
      attachment = <Text style={styles.url}>{this.props.notification.url}</Text>;
    }
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={[styles.cell, !this.props.isSeen && styles.unseen]}>
          <Text style={styles.text}>
            {this.props.notification.text}
          </Text>
          {attachment}
          <View style={styles.footer}>
            <Text style={styles.time}>
              {moment(this.props.notification.time).fromNow()}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  cell: {
    padding: 15,
    backgroundColor: 'white',
  },
  unseen: {
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4D99EF',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  product: {
    paddingVertical: undefined,
    paddingHorizontal: undefined,
    paddingLeft: undefined,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: F8Colors.cellBorder,
    // overflow: 'hidden',
    shadowOffset: {width: 1, height: 1},
    shadowColor: '#eee',
    shadowOpacity: 1,
  },
  footer: {
    flexDirection: 'row',
  },
  url: {
    flex: 1,
    color: F8Colors.actionText,
    fontSize: 12,
    marginBottom: 10,
  },
  time: {
    color: F8Colors.lightText,
    fontSize: 12,
  },
});

function select(store, props) {
  return {
    product: findProductByURI(store.products, props.notification.url),
    isSeen: store.notifications.seen[props.notification.id],
  };
}

module.exports = connect(select)(NotificationCell);
