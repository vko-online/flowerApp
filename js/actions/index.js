/**
 * @flow
 */

'use strict';

const parseActions = require('./parse');
const navigationActions = require('./navigation');
const loginActions = require('./login');
const scheduleActions = require('./schedule');
const filterActions = require('./filter');
const notificationActions = require('./notifications');
const configActions = require('./config');
const surveyActions = require('./surveys');
const testActions = require('./test');
const installationActions = require('./installation');
const basketActions = require('./basket');
const productActions = require('./product');
const favoriteActions = require('./favorites');
const historyActions = require('./history');

module.exports = {
  ...loginActions,
  ...scheduleActions,
  ...filterActions,
  ...notificationActions,
  ...configActions,
  ...surveyActions,
  ...testActions,
  ...parseActions,
  ...navigationActions,
  ...installationActions,
  ...basketActions,
  ...productActions,
  ...favoriteActions,
  ...historyActions
};
