/**
 * @flow
 */
'use strict';

var Image = require('Image');
var PixelRatio = require('PixelRatio');
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');
var InteractionManager = require('InteractionManager');

import type {Map} from '../reducers/maps';

class MapView extends React.Component {
  _isMounted: boolean;
  props: {
    map: ?Map;
    style?: any;
  };
  state: {
    loaded: boolean;
  };

  constructor() {
    super();
    this.state = { loaded: false };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    InteractionManager.runAfterInteractions(() => {
      this._isMounted && this.setState({loaded: true});
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    var image;
    if (this.state.loaded) {
      image = (
        <Image
          style={styles.map}
          source={{uri: urlForMap(this.props.map)}}
        />
      );
    }
    return (
      <View style={[styles.container, this.props.style]}>
        {image}
      </View>
    );
  }
}

function urlForMap(map: ?Map): string {
  if (!map) {
    return '';
  }
  switch (PixelRatio.get()) {
    case 1: return map.x1url;
    case 2: return map.x2url;
    case 3: return map.x3url;
  }
  return map.x3url;
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 400,
  },
  map: {
    flex: 1,
    resizeMode: Image.resizeMode.contain,
  },
});

module.exports = MapView;
