/**
 * @flow
 */

'use strict';

type State = Array<string>;
type Action = { type: string; list: Array<any>; };

function topics(state: State = [], action: Action): State {
  if (action.type === 'LOADED_PRODUCTS') {
    var topicsMap = Object.create(null);
    action.list.forEach((product) => {
      var tags = product.get('tags') || [];
      tags.forEach((tag) => {
        topicsMap[tag] = true;
      });
    });
    return Object.keys(topicsMap).sort();
  }
  return state;
}

module.exports = topics;
