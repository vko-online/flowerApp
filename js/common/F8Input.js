/**
 * @providesModule F8Input
 * @flow
 */

'use strict';

var F8Colors = require('F8Colors');
import LinearGradient from "react-native-linear-gradient";
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');
var Dimensions = require('Dimensions');
var Text = require('Text');
var TextInput = require('TextInput');
var DatePickerIOS = require('DatePickerIOS');

class F8Input extends React.Component {
  props:{
    label: string;
    value: string;
    style?: any;
    numberOfLines?: number;
    isDate?: boolean;
    onChange: () => mixed;
  };

  render() {
    const offset = (-1) * (new Date()).getTimezoneOffset() / 60;

    let textInput = this.props.numberOfLines ?
      (
        <TextInput
          multiline={true}
          numberOfLines={this.props.numberOfLines}
          onChangeText={val => this.props.onChange(val)}
          style={[styles.input, styles.inputLarge]}
          value={this.props.value}
        />
      )
      :
      (
        <TextInput
          onChangeText={val => this.props.onChange(val)}
          style={styles.input}
          value={this.props.value}
        />
      );

    return (
      <View style={styles.formGroup}>
        <LinearGradient colors={['#F4F6F7', '#EBEEF1']} style={styles.formHeader}>
          <Text style={styles.label}>
            {this.props.label}
          </Text>
        </LinearGradient>
        {textInput}
      </View>
    )
  }
}
var styles = StyleSheet.create({
  formGroup: {
    justifyContent: 'center',
    width: Dimensions.get('window').width
  },
  formHeader: {
    height: 32,
    justifyContent: 'center',
    paddingLeft: 17,
  },
  label: {
    color: F8Colors.lightText,
    backgroundColor: 'transparent'
  },
  input: {
    height: 40,
    fontSize: 17,
    color: F8Colors.darkText,
    paddingLeft: 17,
  },
  inputLarge: {
    height: 80,
  }
});

module.exports = F8Input;
