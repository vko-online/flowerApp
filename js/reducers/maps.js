/**
 * @flow
 */

'use strict';

const createParseReducer = require('./createParseReducer');

export type Map = {
  id: string;
  name: string;
  x1url: string;
  x2url: string;
  x3url: string;
};

function fromParseObject(map: Object): Map {
  return {
    id: map.id,
    name: map.get('name'),
    x1url: map.get('x1') && map.get('x1').url(),
    x2url: map.get('x2') && map.get('x2').url(),
    x3url: map.get('x3') && map.get('x3').url(),
  };
}

module.exports = createParseReducer('LOADED_MAPS', fromParseObject);
