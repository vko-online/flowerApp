/**
 * @flow
 */

'use strict';

const Parse = require('parse');

jest.dontMock('../notifications');
jest.dontMock('crc32');
const notifications = require('../notifications');

const emptyAction: any = {};
const empty = {server: [], push: [], enabled: null, registered: false, seen: {}};

describe('notifications reducer', () => {

  it('is empty by default', () => {
    expect(notifications(undefined, emptyAction)).toEqual(empty);
  });

  it('populates notifications from server', () => {
    let list = [
      new Parse.Object({text: 'hello', url: 'https://fbf8.com'}),
      new Parse.Object({text: 'bye', url: null}),
    ];

    let {server} = notifications(empty, {type: 'LOADED_NOTIFICATIONS', list});

    expect(server).toEqual([{
      id: jasmine.any(String),
      text: 'hello',
      url: 'https://fbf8.com',
      time: jasmine.any(Number),
    }, {
      id: jasmine.any(String),
      text: 'bye',
      url: null,
      time: jasmine.any(Number),
    }]);
  });

  it('skips duplicates', () => {
    const notification = {
      text: 'Hello, world!',
      url: null,
      time: 1234567,
    };

    const action1 = {
      type: 'RECEIVED_PUSH_NOTIFICATION',
      notification: {...notification},
    };
    const action2 = {
      type: 'RECEIVED_PUSH_NOTIFICATION',
      notification: {...notification},
    };

    const {push} = notifications(notifications(empty, action1), action2);
    expect(push).toEqual([{
      id: jasmine.any(String),
      ...notification
    }]);
  });

});
