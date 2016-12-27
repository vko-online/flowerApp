/**
 * @flow
 */

'use strict';

var { combineReducers } = require('redux');

module.exports = combineReducers({
  config: require('./config'),
  notifications: require('./notifications'),
  maps: require('./maps'),
  sessions: require('./sessions'),
  user: require('./user'),
  schedule: require('./schedule'),
  topics: require('./topics'),
  filter: require('./filter'),
  navigation: require('./navigation'),
  friendsSchedules: require('./friendsSchedules'),
  friendsFavorites: require('./friendsFavorites'),
  surveys: require('./surveys'),
  products: require('./products'),
  basket: require('./basket'),
  favorites: require('./favorites'),
  history: require('./history')
});
