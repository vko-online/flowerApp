/**
 * @flow
 */

'use strict';

jest.dontMock('../schedule');
const schedule = require('../schedule');

describe('schedule reducer', () => {

  it('is empty by default', () => {
    expect(schedule(undefined, ({}: any))).toEqual({});
  });

  it('adds sessions to schedule', () => {
    expect(
      schedule({}, {type: 'SESSION_ADDED', id: 'one'})
    ).toEqual({one: true});

    expect(
      schedule({one: true}, {type: 'SESSION_ADDED', id: 'two'})
    ).toEqual({one: true, two: true});
  });

  it('removes sessions from schedule', () => {
    expect(
      schedule({
        one: true,
        two: true,
      }, {
        type: 'SESSION_REMOVED',
        id: 'two',
      })
    ).toEqual({
      one: true,
    });
  });

  it('restores schedule when logging in', () => {
    expect(
      schedule({
        one: true,
      }, {
        type: 'RESTORED_SCHEDULE',
        list: [{id: 'two'}, {id: 'three'}],
      })
    ).toEqual({
      two: true,
      three: true,
    });
  });

  it('clears schedule when logging out', () => {
    expect(
      schedule({
        one: true,
        two: true,
      }, {
        type: 'LOGGED_OUT',
      })
    ).toEqual({});
  });

});
