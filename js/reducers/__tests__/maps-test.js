/**
 * @flow
 */

'use strict';

jest.autoMockOff();

const Parse = require('parse');
const maps = require('../maps');

describe('maps reducer', () => {

  it('is empty by default', () => {
    expect(maps(undefined, {})).toEqual([]);
  });

  it('populates maps from server', () => {
    let list = [
      new Parse.Object({
        name: 'Day 1',
        x1: new Parse.File('x1.png'),
        x2: new Parse.File('x2.png'),
        x3: new Parse.File('x3.png'),
      }),
    ];

    expect(
      maps([], {type: 'LOADED_MAPS', list})
    ).toEqual([{
      id: jasmine.any(String),
      name: 'Day 1',
      x1url: 'x1.png',
      x2url: 'x2.png',
      x3url: 'x3.png',
    }]);
  });

});
