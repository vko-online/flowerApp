/**
 * @flow
 */

'use strict';

var React = require('React');
var StyleSheet = require('StyleSheet');
var { Text } = require('F8Text');
var View = require('View');

class Section extends React.Component {
  render() {
    var {children, title} = this.props;
    if (React.Children.count(children) === 0) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {title.toUpperCase()}
        </Text>
        {children}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginBottom: 50,
  },
  title: {
    fontSize: 12,
    letterSpacing: 1,
    color: '#A0B7FF',
    textAlign: 'center',
    margin: 10,
  },
});

module.exports = Section;
