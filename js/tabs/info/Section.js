/**
 * @flow
 */
'use strict';

var React = require('React');
var StyleSheet = require('StyleSheet');
var { Text } = require('F8Text');
var View = require('View');

class Section extends React.Component {
  props: {
    title: string;
    children?: any;
    style?: any;
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {this.props.title}
          </Text>
        </View>
        {this.props.children}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 0,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

module.exports = Section;
