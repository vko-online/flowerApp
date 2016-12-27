/**
 * @providesModule F8Touchable
 * @flow
 */

'use strict';

import React from 'react';
import {
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

function F8TouchableIOS(props: Object): ReactElement {
  return (
    <TouchableHighlight
      accessibilityTraits="button"
      underlayColor="#3C5EAE"
      {...props}
    />
  );
}

const F8Touchable = Platform.OS === 'android'
  ? TouchableNativeFeedback
  : F8TouchableIOS;

module.exports = F8Touchable;
