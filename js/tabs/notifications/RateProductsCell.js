/**
 * @flow
 */
'use strict';

var F8Colors = require('F8Colors');
var React = require('React');
var StyleSheet = require('StyleSheet');
var { Text } = require('F8Text');
var TouchableOpacity = require('TouchableOpacity');
var View = require('View');
var Image = require('Image');

type Props = {
  numberOfProducts: number;
  onPress: () => void;
};

function RateProductsCell({numberOfProducts, onPress}: Props) {
  const pluralSuffix = numberOfProducts === 1 ? '' : 's';
  return (
    <View style={styles.cell}>
      <Image
        style={styles.star}
        source={require('../../rating/img/full-star.png')}
      />
      <Text style={styles.text}>
        You have {numberOfProducts} product{pluralSuffix} to review
      </Text>

      <TouchableOpacity accessibilityTraits="button" onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.caption}>
            REVIEW
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

var styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    color: F8Colors.darkText,
    flex: 1,
  },
  button: {
    backgroundColor: '#6F86D9',
    height: 30,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    color: 'white',
    letterSpacing: 1,
    fontSize: 12,
  },
});

module.exports = RateProductsCell;
