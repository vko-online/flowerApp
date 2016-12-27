/**
 * @flow
 */
'use strict';

const React = require('react');
const {
  Image,
  StyleSheet,
} = require('react-native');


class ProfileButton extends React.Component {
  render() {
    return (
      <Image
        source={{uri: `http://graph.facebook.com/${this.props.user.id}/picture`}}
        style={styles.profilePic}
      />
    );
  }
}

var styles = StyleSheet.create({
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

module.exports = ProfileButton;
