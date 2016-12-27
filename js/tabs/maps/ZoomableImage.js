/**
 * @flow
 */
'use strict';

var Image = require('Image');
var React = require('React');
var ScrollView = require('ScrollView');
var StyleSheet = require('StyleSheet');
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');

class ZoomableImage extends React.Component {
  props: {
    url: string;
  };
  state: {
    lastTapTimestamp: number;
    isZoomed: boolean;
  };

  constructor() {
    super();
    this.state = {
      lastTapTimestamp: 0,
      isZoomed: false,
    };

    (this: any).onZoomChanged = this.onZoomChanged.bind(this);
    (this: any).toggleZoom = this.toggleZoom.bind(this);
  }

  render() {
    return (
      <ScrollView
        ref="zoomable_scroll"
        onScroll={this.onZoomChanged}
        scrollEventThrottle={100}
        scrollsToTop={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={4}
        centerContent={true}
        contentContainerStyle={{flex: 1}}>
        <TouchableWithoutFeedback onPress={this.toggleZoom}>
          <Image
            style={styles.image}
            source={{uri: this.props.url}}
          />
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }

  toggleZoom(e: any) {
    var timestamp = new Date().getTime();
    if (timestamp - this.state.lastTapTimestamp <= 500) {
      var {locationX, locationY} = e.nativeEvent;
      var size = this.state.isZoomed ? {width: 10000, height: 10000} : {width: 0, height: 0};
      this.refs.zoomable_scroll.scrollResponderZoomTo({x: locationX, y: locationY, ...size});
    }
    this.setState({lastTapTimestamp: timestamp});
  }

  onZoomChanged(e: any) {
    this.setState({isZoomed: e.nativeEvent.zoomScale > 1});
  }
}

var styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: Image.resizeMode.contain,
  },
});

module.exports = ZoomableImage;
