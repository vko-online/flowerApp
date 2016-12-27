/**
 * @flow
 */

'use strict';

var Image = require('Image');
import LinearGradient from "react-native-linear-gradient";
var React = require('React');
var StyleSheet = require('StyleSheet');
var {Text} = require('F8Text');
var TouchableOpacity = require('TouchableOpacity');
var View = require('View');
var Dimensions = require('Dimensions');

type Props = {
  onPress: () => void;
  style?: any;
};


class CheckoutButton extends React.Component {
  props:Props;

  constructor(props:Props) {
    super(props);
  }

  render() {
    const colors = ['#6A6AD5', '#6F86D9'];
    return (
      <TouchableOpacity
        accessibilityLabel="Checkout"
        accessibilityTraits="button"
        onPress={this.props.onPress}
        activeOpacity={0.9}
        style={[styles.container, this.props.style]}>
        <LinearGradient
          start={[0.5, 1]} end={[1, 1]}
          colors={colors}
          collapsable={false}
          style={styles.button}>
          <View style={styles.content}>
            <Text style={styles.caption}>Checkout</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const HEIGHT = 50;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: HEIGHT,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 100,
    marginLeft: 50
  },
  button: {
    flex: 1,
    borderRadius: HEIGHT / 2,
    backgroundColor: 'transparent',
    paddingHorizontal: 40,
  },
  content: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  caption: {
    letterSpacing: 1,
    fontSize: 16,
    color: 'white',
  },
});

module.exports = CheckoutButton;
// // $FlowFixMe
// module.exports.__cards__ = (define) => {
//   let f;
//   setInterval(() => f && f(), 1000);
//
//   define('Inactive', (state = true, update) =>
//     <AddToBasketButton isAdded={state} onPress={() => update(!state)} />);
//
//   define('Active', (state = false, update) =>
//     <AddToBasketButton isAdded={state} onPress={() => update(!state)} />);
//
//   define('Animated', (state = false, update) => {
//     f = () => update(!state);
//     return <AddToBasketButton isAdded={state} onPress={() => {}} />;
//   });
// };
