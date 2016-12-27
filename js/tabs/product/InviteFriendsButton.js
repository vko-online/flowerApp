/**
 * @flow
 */
'use strict';

var React = require('React');
var F8Button = require('F8Button');
var {AppInviteDialog, AppEventsLogger} = require('react-native-fbsdk');
var { connect } = require('react-redux');

class InviteFriendsButton extends React.Component {
  props: {
    appLinkURL: string;
    appInvitePreviewImageURL: string;
    style: any;
  };

  render() {
    const {appLinkURL, style} = this.props;
    if (!appLinkURL) {
      return null;
    }

    return (
      <F8Button
        style={style}
        caption="Invite friends to the F8 app"
        onPress={() => this.inviteFriends()}
      />
    );
  }

  inviteFriends() {
    AppEventsLogger.logEvent('Invite Friends', 1);
    AppInviteDialog.show({
      applinkUrl: this.props.appLinkURL,
      previewImageUrl: this.props.appInvitePreviewImageURL,
    }).catch((error) => {
      if (error.message) {
        alert(error.message);
      }
    });
  }
}

function select(store) {
  return {
    appLinkURL: store.config.appLinkURL,
    appInvitePreviewImageURL: store.config.appInvitePreviewImageURL,
  };
}

module.exports = connect(select)(InviteFriendsButton);
