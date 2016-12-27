/**
 * @providesModule F8FriendGoingProduct
 * @flow
 */
'use strict';

var ProfilePicture = require('../../common/ProfilePicture');
var React = require('React');
var StyleSheet = require('StyleSheet');
var { Text } = require('F8Text');
var View = require('View');
var Image = require('Image');
var F8Touchable = require('F8Touchable');

import type {FriendsFavorites} from '../../reducers/friendsFavorites';

class F8FriendFavorites extends React.Component {
  props: {
    onPress: () => void;
    friend: FriendsFavorites;
  };

  render() {
    return (
      <F8Touchable onPress={this.props.onPress}>
        <View style={styles.container}>
          <ProfilePicture userID={this.props.friend.id} size={18} />
          <Text style={styles.name}>
            {this.props.friend.name}
          </Text>
          <Image source={require('../../common/img/disclosure.png')} />
        </View>
      </F8Touchable>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  name: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
  },
});

module.exports = F8FriendFavorites;
