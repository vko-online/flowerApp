/**
 * @flow
 */
'use strict';

var Image = require('Image');
var React = require('React');
var PixelRatio = require('PixelRatio');

class ProfilePicture extends React.Component {
  props: {
    userID: string;
    size: number;
  };

  render() {
    const {userID, size} = this.props;
    const scaledSize = size * PixelRatio.get();
    const uri = `http://graph.facebook.com/${userID}/picture?width=${scaledSize}&height=${scaledSize}`;
    return (
      <Image
        source={{uri}}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }
}

module.exports = ProfilePicture;
