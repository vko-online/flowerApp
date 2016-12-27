/**
 * @providesModule F8MapView
 * @flow
 */
'use strict';

var ActionSheetIOS = require('ActionSheetIOS');
var F8Button = require('F8Button');
var PureListView = require('../../common/PureListView');
var Linking = require('Linking');
var Platform = require('Platform');
var ListContainer = require('ListContainer');
var MapView = require('../../common/MapView');
var React = require('React');
var StyleSheet = require('F8StyleSheet');
var View = require('View');
var { connect } = require('react-redux');

var VENUE_ADDRESS = '2 Marina Blvd, San Francisco, CA 94123';

class F8MapView extends React.Component {
  constructor() {
    super();

    (this: any).handleGetDirections = this.handleGetDirections.bind(this);
    (this: any).openMaps = this.openMaps.bind(this);

    console.log('OMG', this.props);
  }

  render() {
    const {map1, map2} = this.props;

    return (
      <View style={styles.container}>
        <ListContainer
          title="Maps"
          backgroundImage={require('./img/maps-background.png')}
          backgroundColor={'#9176D2'}>
          <PureListView
            title="Overview"
            renderEmptyList={() => <MapView map={map1} />}
          />
          <PureListView
            title="Developer Garage"
            renderEmptyList={() => <MapView map={map2} />}
          />
        </ListContainer>
        <F8Button
          type="secondary"
          icon={require('./img/directions.png')}
          caption="Directions to Fort Mason Center"
          onPress={this.handleGetDirections}
          style={styles.directionsButton}
        />
      </View>
    );
  }

  handleGetDirections() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: VENUE_ADDRESS,
          options: ['Open in Apple Maps', 'Open in Google Maps', 'Cancel'],
          destructiveButtonIndex: -1,
          cancelButtonIndex: 2,
        },
        this.openMaps
      );
    } else if (Platform.OS === 'android') {
      var address = encodeURIComponent(VENUE_ADDRESS);
      Linking.openURL('http://maps.google.com/maps?&q=' + address);
    }
  }

  openMaps(option) {
    var address = encodeURIComponent(VENUE_ADDRESS);
    switch (option) {
      case 0:
        Linking.openURL('http://maps.apple.com/?q=' + address);
        break;

      case 1:
        var nativeGoogleUrl = 'comgooglemaps-x-callback://?q=' +
          address + '&x-success=f8://&x-source=F8';
        Linking.canOpenURL(nativeGoogleUrl).then((supported) => {
          var url = supported ? nativeGoogleUrl : 'http://maps.google.com/?q=' + address;
          Linking.openURL(url);
        });
        break;
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  directionsButton: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    ios: {
      bottom: 49,
    },
    android: {
      bottom: 0,
    },
  },
});

function select(store) {
  return {
    map1: store.maps.find((map) => map.name === 'Overview'),
    map2: store.maps.find((map) => map.name === 'Developer Garage'),
  };
}

module.exports = connect(select)(F8MapView);
