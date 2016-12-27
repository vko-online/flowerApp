/**
 * @flow
 */

'use strict';

const Parse = require('parse/react-native');

import { PromiseAction } from "./types";

async function restoreHistory():PromiseAction {
  const list = await Parse.User.current().relation('myHistory').query().find();
  return {
    type: 'RESTORED_HISTORY',
    list,
  };
}


module.exports = {
  restoreHistory
};