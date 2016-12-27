/**
 * @flow
 */
'use strict';

var Image = require('Image');
var React = require('React');
var StyleSheet = require('StyleSheet');
var { Paragraph, Heading1 } = require('F8Text');
var View = require('View');

class EmptyProduct extends React.Component {
  props: {
    style?: any;
    title?: string;
    image?: number;
    text: string;
    children?: any;
  };

  render() {
    const image = this.props.image &&
      <Image style={styles.image} source={this.props.image} />;
    const title = this.props.title &&
      <Heading1 style={styles.title}>{this.props.title}</Heading1>;

    return (
      <View style={[styles.container, this.props.style]}>
        {image}
        {title}
        <Paragraph style={styles.text}>
          {this.props.text}
        </Paragraph>
        {this.props.children}
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
    paddingTop: 75,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    marginBottom: 35,
  },
});

module.exports = EmptyProduct;
