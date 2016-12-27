/**
 * @flow
 */

'use strict';

var { combineReducers } = require('redux');

module.exports = combineReducers({
  config: require('./config'),
  notifications: require('./notifications'),
  maps: require('./maps'),
  user: require('./user'),
  topics: require('./topics'),
  filter: require('./filter'),
  navigation: require('./navigation'),
  friendsFavorites: require('./friendsFavorites'),
  surveys: require('./surveys'),
  products: require('./products'),
  basket: require('./basket'),
  favorites: require('./favorites'),
  history: require('./history'),
  order: require('./order')
});
