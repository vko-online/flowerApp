/**
 * @flow
 * @providesModule F8ProductDetails
 */

'use strict';
import Icon from 'react-native-vector-icons/FontAwesome';
var Animated = require('Animated');
var F8Colors = require('F8Colors');
var F8FriendGoing = require('F8FriendGoingProduct');
var F8SpeakerProfile = require('F8SpeakerProfile');
var Image = require('Image');
import LinearGradient from 'react-native-linear-gradient';
var MapView = require('../../common/MapView');
var PixelRatio = require('PixelRatio');
var React = require('React');
var Dimensions = require('Dimensions');
var ScrollView = require('ScrollView');
var StyleSheet = require('StyleSheet');
var Subscribable = require('Subscribable');
var { Text } = require('F8Text');
var TouchableOpacity = require('TouchableOpacity');
var View = require('View');
var AddToBasketButton = require('./AddToBasketButton');
var {WIDTH} = Dimensions.get('window');


var {connect} = require('react-redux');
var {
  addToBasket,
  removeFromBasketWithPrompt,
  addToFavorites,
  removeFromFavorites
} = require('../../actions');

var F8ProductDetails = React.createClass({
  mixins: [Subscribable.Mixin],

  getInitialState: function() {
    return {
      scrollTop: new Animated.Value(0),
    };
  },

  render: function() {
    var topics = null;
    var {tags} = this.props.product;
    if (tags && tags.length > 0) {
      topics = (
        <Text style={styles.topics}>
          TOPICS: {tags.join(', ')}
        </Text>
      );
    }

    var friendsGoing = this.props.friendsGoing.map(
      (friend) => (
        <F8FriendGoing
          key={friend.id}
          friend={friend}
          onPress={() => this.props.navigator.push({friend})}
        />
      )
    );

    var title = this.props.product.title || '';

    return (
      <View style={[styles.container, this.props.style]}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          onScroll={({nativeEvent}) => this.state.scrollTop.setValue(nativeEvent.contentOffset.y)}
          scrollEventThrottle={100}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.description}>
            {this.props.product.description}
          </Text>
          <Image style={styles.picture} source={{uri: this.props.product.image}}/>
          <Section>
            {topics}
          </Section>
          <Section title="Friends Going">
            {friendsGoing}
          </Section>
          <TouchableOpacity
            accessibilityLabel="Share this product"
            accessibilityTraits="button"
            onPress={this.props.onShare}
            style={styles.shareButton}>
            <Image source={require('./img/share.png')} />
          </TouchableOpacity>
          {
            this.props.isAddedToFavorites ?
              <TouchableOpacity
                accessibilityLabel="Remove from favorites"
                accessibilityTraits="button"
                onPress={this.props.toggleAddedFavorites}
                style={styles.favoriteButton}>
                <Icon name="star" size={30} color="#00f"/>
              </TouchableOpacity>
              :
              <TouchableOpacity
                accessibilityLabel="Add to favorites"
                accessibilityTraits="button"
                onPress={this.props.toggleAddedFavorites}
                style={styles.favoriteButton}>
                <Icon name="star-o" size={30} color="#e1e1e1"/>
              </TouchableOpacity>
          }
        </ScrollView>
        <View style={styles.actions}>
          <AddToBasketButton
            isAdded={this.props.isAddedToBasket}
            onPress={this.toggleAdded}
          />
        </View>
        <Animated.View style={[
          styles.miniHeader,
          {
            opacity: this.state.scrollTop.interpolate({
              inputRange: [0, 150, 200],
              outputRange: [0, 0, 1],
              extrapolate: 'clamp',
            })
          }
        ]}>
          <Text numberOfLines={1} style={styles.miniTitle}>
            {title}
          </Text>
        </Animated.View>
      </View>
    );
  },

  toggleAddedFavorites: function() {
    if (this.props.isAddedToFavorites) {
      this.props.onRemoveFavorites();
    } else {
      this.addToFavorites();
    }
  },
  addToFavorites: function() {
    if (!this.props.isLoggedIn) {
      this.props.navigator.push({
        login: true, // TODO: Proper route
        callback: this.addToFavorites,
      });
    } else {
      this.props.onAddFavorites();
      if (this.props.sharedProduct === null) {
        setTimeout(() => this.props.navigator.push({share: true}), 1000);
      }
    }
  },

  toggleAdded: function() {
    if (this.props.isAddedToBasket) {
      this.props.removeFromBasketWithPrompt();
    } else {
      this.addToBasket();
    }
  },

  addToBasket: function() {
    if (!this.props.isLoggedIn) {
      this.props.navigator.push({
        login: true, // TODO: Proper route
        callback: this.addToBasket,
      });
    } else {
      this.props.addToBasket();
    }
  },
});

class Section extends React.Component {
  props: {
    title?: string;
    children?: any;
  };

  render() {
    var {children} = this.props;
    if (React.Children.count(children) === 0) {
      return null;
    }
    var header;
    if (this.props.title) {
      header = (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {this.props.title.toUpperCase()}
          </Text>
          <LinearGradient
            start={[0, 0]} end={[1, 0]}
            colors={['#E1E1E1', 'white']}
            style={styles.line}
          />
        </View>
      );
    }
    return (
      <View style={styles.section}>
        {header}
        {children}
      </View>
    );
  }
}

var PADDING = 15;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 26,
    paddingBottom: 60,
  },
  miniHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 12,
    top: 0,
    right: 12,
    paddingVertical: 9,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#E1E1E1',
  },
  miniTitle: {
    fontSize: 12,
    flex: 1,
    color: F8Colors.darkText,
  },
  location: {
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -1,
    lineHeight: 32,
    marginVertical: 20,
  },
  time: {
    color: F8Colors.lightText,
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    lineHeight: 25,
  },
  topics: {
    fontSize: 12,
    color: F8Colors.lightText,
  },
  section: {
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  sectionTitle: {
    color: F8Colors.lightText,
    marginRight: 14,
    fontSize: 12,
  },
  line: {
    height: 1 / PixelRatio.get(),
    backgroundColor: F8Colors.lightText,
    flex: 1,
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    margin: 10,
    paddingVertical: 10,
    borderTopColor: '#eeeeee',
    backgroundColor: 'white',
  },
  shareButton: {
    backgroundColor: 'transparent',
    padding: PADDING,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  favoriteButton: {
    backgroundColor: 'transparent',
    padding: PADDING,
    position: 'absolute',
    right: 40,
    top: 0,
  },
  picture: {
    width: WIDTH,
    height: 200
  }
});

function select(store, props) {
  const productID = props.product.id;
  const friendsGoing = store.friendsFavorites.filter((friend) => friend.favorites[productID]);

  return {
    isAddedToBasket: !!store.basket[props.product.id],
    isAddedToFavorites: !!store.favorites[props.product.id],
    isLoggedIn: store.user.isLoggedIn,
    sharedProduct: store.user.sharedProduct,
    productURLTemplate: store.config.productURLTemplate,
    topics: store.topics,
    friendsGoing,
  };
}

function actions(dispatch, props) {
  let id = props.product.id;
  return {
    addToBasket: () => dispatch(addToBasket(id)),
    removeFromBasketWithPrompt: () => dispatch(removeFromBasketWithPrompt(props.product)),
    onAddFavorites: () => dispatch(addToFavorites(id)),
    onRemoveFavorites: () => dispatch(removeFromFavorites(id))
  };
}

module.exports = connect(select, actions)(F8ProductDetails);
