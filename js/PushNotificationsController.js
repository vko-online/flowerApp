/**
 * @flow
 */

'use strict';

var React = require('react');
var AppState = require('AppState');
var Platform = require('Platform');
var unseenNotificationsCount = require('./tabs/notifications/unseenNotificationsCount');
var PushNotificationIOS = require('PushNotificationIOS');
// $FlowIssue
var PushNotification = require('react-native-push-notification');

var { connect } = require('react-redux');
var {
  storeDeviceToken,
  receivePushNotification,
  updateInstallation,
  markAllNotificationsAsSeen,
} = require('./actions');

import type {Dispatch} from './actions/types';

const PARSE_CLOUD_GCD_SENDER_ID = '1076345567071';

class AppBadgeController extends React.Component {
  props: {
    tab: string;
    enabled: boolean;
    badge: number;
    dispatch: Dispatch;
  };

  constructor() {
    super();

    (this: any).handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  handleAppStateChange(appState) {
    if (appState === 'active') {
      this.updateAppBadge();
      if (this.props.tab === 'notifications') {
        this.eventuallyMarkNotificationsAsSeen();
      }
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    const {dispatch} = this.props;
    PushNotification.configure({
      onRegister: ({token}) => dispatch(storeDeviceToken(token)),
      onNotification: (notif) => dispatch(receivePushNotification(notif)),
      senderID: PARSE_CLOUD_GCD_SENDER_ID,
      requestPermissions: this.props.enabled,
    });

    this.updateAppBadge();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.enabled && this.props.enabled) {
      PushNotification.requestPermissions();
    }
    if (this.props.badge !== prevProps.badge) {
      this.updateAppBadge();
    }
    if (this.props.tab === 'notifications' && prevProps.tab !== 'notifications') {
      this.eventuallyMarkNotificationsAsSeen();
    }
  }

  updateAppBadge() {
    if (this.props.enabled && Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(this.props.badge);
      updateInstallation({badge: this.props.badge});
    }
  }

  eventuallyMarkNotificationsAsSeen() {
    const {dispatch} = this.props;
    setTimeout(() => dispatch(markAllNotificationsAsSeen()), 1000);
  }

  render() {
    return null;
  }
}

function select(store) {
  return {
    enabled: store.notifications.enabled === true,
    badge: unseenNotificationsCount(store) + store.surveys.length,
    tab: store.navigation.tab,
  };
}

module.exports = connect(select)(AppBadgeController);
