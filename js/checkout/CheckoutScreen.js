/**
 * @flow
 */
'use strict';

var React = require('React');
import Icon from "react-native-vector-icons/FontAwesome";
import { State as User } from "../reducers/user";
var StyleSheet = require('StyleSheet');
var {Text} = require('F8Text');
var Navigator = require('Navigator');
var View = require('View');
var ScrollView = require('ScrollView');
var F8Header = require('F8Header');
var F8Colors = require('F8Colors');
var StatusBar = require('StatusBar');
var TextInput = require('TextInput');
var Dimensions = require('Dimensions');
var {tryCheckout} = require('../actions');
var {connect} = require('react-redux');
var F8Input = require('F8Input');
var F8Date = require('F8Date');
var F8Button = require('F8Button');

class SharingSettingsScreen extends React.Component {
  props:{
    navigator: Navigator;
    dispatch: () => void;
    user: User;
    processCheckout: () => void;
  };

  constructor(props) {
    super(props);

    (this: any).handleCheckout = this.handleCheckout.bind(this);

    const today = new Date();
    today.setDate(today.getDate() + 3);

    this.state = {
      address: 'Keas 69 Str. 15234, Chalandri Athens, Greece',
      phone: '87773965972',
      deliveryDate: '2016-05-15',
      notes: 'Домой принесли повестку из военкомата без указания причины. Почтальон сказал что вызывают для того что бы вклеить какой то вкладыш в военник.'
    }
  }

  handleCheckout() {
    var {address, phone, notes, deliveryDate} = this.state;
    this.props.processCheckout({
      products: this.props.products.filter(p => !!this.props.basket[p]),
      address,
      phone,
      notes,
      deliveryDate
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="default"
        />
        <View style={styles.content}>
          <F8Input label="Phone"
                   value={this.state.phone}
                   onChange={(val) => this.setState({phone:val})}/>
          <F8Date label="Delivery Date"
                  value={this.state.deliveryDate}
                  onChange={(val) => this.setState({deliveryDate:val})}/>
          <F8Input label="Address"
                   value={this.state.address}
                   onChange={(val) => this.setState({address:val})}
                   numberOfLines={4}/>
          <F8Input label="Notes"
                   value={this.state.notes}
                   onChange={(val) => this.setState({notes:val})}
                   numberOfLines={4}/>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.additional}>
            <Icon name="check" size={30} color="#00E3AD"/>
            <Text style={styles.additionalNote}>Payment after delivery</Text>
          </View>
          <View style={styles.additional}>
            <Icon name="check" size={30} color="#00E3AD"/>
            <Text style={styles.additionalNote}>30 day money back guarantee</Text>
          </View>
          <View style={styles.additional}>
            <Icon name="check" size={30} color="#00E3AD"/>
            <Text style={styles.additionalNote}>10% off this month</Text>
          </View>
          <F8Button
            style={styles.button}
            caption="Proceed"
            onPress={this.handleCheckout}
          />
        </View>
        <F8Header
          style={styles.header}
          foreground="dark"
          title="Checkout"
          leftItem={{
            icon: require('../common/img/back.png'),
            title: 'Back',
            layout: 'icon',
            onPress: () => this.props.navigator.pop(),
          }}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 49,
    height: Dimensions.get('window').height
  },
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
  },
  content: {
    marginTop: F8Header.height,
  },
  button: {
    width: Dimensions.get('window').width - 100,
    marginLeft: 50,
    marginTop: 10
  },
  additional: {
    paddingLeft: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  additionalNote: {
    color: F8Colors.darkText,
    fontSize: 17,
    paddingLeft: 10
  },
  wrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0
  }
});

function select(store) {
  return {
    user: store.user,
    basket: store.basket,
  };
}

function actions(dispatch) {
  return {
    processCheckout: order => dispatch(tryCheckout(order)),
  };
}

module.exports = connect(select, actions)(SharingSettingsScreen);
