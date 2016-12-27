/**
 * @providesModule F8Date
 * @flow
 */

'use strict';

var F8Colors = require('F8Colors');
import LinearGradient from "react-native-linear-gradient";
import DatePicker from "react-native-datepicker";
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');
var Dimensions = require('Dimensions');
var Text = require('Text');
var TextInput = require('TextInput');

class F8Date extends React.Component {
  props:{
    label: string;
    value: string;
    style?: any;
    onChange: () => mixed;
  };

  render() {

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 15);

    return (
      <View style={styles.formGroup}>
        <LinearGradient colors={['#F4F6F7', '#EBEEF1']} style={styles.formHeader}>
          <Text style={styles.label}>
            {this.props.label}
          </Text>
        </LinearGradient>
        <DatePicker
          style={styles.input}
          date={this.props.value}
          mode="date"
          customStyles={{
            dateInput: {
              borderWidth: 0,
              marginLeft: 0,
              paddingLeft: 0,
              alignItems: 'flex-start',
            }
          }}
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate={today}
          maxDate={maxDate}
          confirmBtnText="Confirm"
          showIcon={false}
          cancelBtnText="Cancel"
          onDateChange={date => this.props.onChange(date)}
        />
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
    width: Dimensions.get('window').width - 100,
    paddingLeft: 17,
    marginBottom: 1,
  },
});

module.exports = F8Date;
