/**
 * @flow
 */

'use strict';

var React = require('React');
var StyleSheet = require('StyleSheet');
var { Text } = require('F8Text');
const TouchableOpacity = require('TouchableOpacity');
const View = require('View');

class Header extends React.Component {
  render() {
    return (
      <View style={[styles.header, this.props.style]}>
        <View style={styles.leftItem}>
          {this.renderItem(this.props.leftItemTitle, this.props.onLeftItemPress)}
        </View>
        <View style={styles.centerItem}>
          <Text style={[styles.titleText, this.props.titleStyle]}>
            {this.props.title}
          </Text>
        </View>
        <View style={styles.rightItem}>
          {this.renderItem(this.props.rightItemTitle, this.props.onRightItemPress)}
        </View>
      </View>
    );
  }

  renderItem(title: string, onPress: () => void) {
    if (!title) {
      return null;
    }

    return (
      <TouchableOpacity onPress={onPress} style={styles.itemWrapper}>
        <Text style={styles.itemTitle}>
          {title.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
}

var STATUS_BAR_HEIGHT = 20;
var HEADER_HEIGHT = STATUS_BAR_HEIGHT + /* toolbar */ 44;

var styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
    paddingTop: STATUS_BAR_HEIGHT,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 17,
  },
  leftItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerItem: {
    flex: 2,
    alignItems: 'center',
  },
  rightItem: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemWrapper: {
    padding: 11,
  },
  itemTitle: {
    letterSpacing: 1,
    fontSize: 12,
    color: 'white',
  },
});


module.exports = Header;
