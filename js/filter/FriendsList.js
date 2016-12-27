/**
 * @flow
 */

'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = React;

type Friend = {
  id: string;
  name: string;
};

class FriendsList extends React.Component {
  props: {
    friends: Array<Friend>;
    onPress: (friend: Friend) => void;
  };

  render() {
    if (this.props.friends.length === 0) {
      return (
        <View style={[styles.container, styles.noFriends]}>
          <Text style={styles.text}>
            No friends have shared their schedule.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {this.props.friends.map((friend) =>
          <UserPog
            user={friend}
            key={friend.id}
            onPress={() => this.props.onPress(friend)}
          />
        )}
      </View>
    );
  }
}

class UserPog extends React.Component {
  props: {
    user: Friend;
    onPress: () => void;
  };

  render() {
    var {id, name} = this.props.user;
    var firstName = name.split(' ')[0]; // TODO: problems with i18n
    return (
      <TouchableOpacity style={styles.pog} onPress={this.props.onPress}>
        <Image
          style={styles.profilePic}
          source={{uri: `http://graph.facebook.com/${id}/picture`}}
        />
        <Text style={styles.text}>
          {firstName}
        </Text>
      </TouchableOpacity>
    );
  }
}

const SIZE = 50;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFriends: {
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'rgba(3, 34, 80, 0.15)',
  },
  pog: {
    alignItems: 'center',
    margin: 6,
  },
  profilePic: {
    marginBottom: 6,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  text: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  }
});

module.exports = FriendsList;
