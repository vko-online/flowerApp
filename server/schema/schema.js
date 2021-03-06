import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from "graphql";
import { fromGlobalId, globalIdField, mutationWithClientMutationId, nodeDefinitions } from "graphql-relay";
import Parse from "parse/node";

const Page = Parse.Object.extend('Page');
const FAQ = Parse.Object.extend('FAQ');
const Session = Parse.Object.extend('Agenda');
const Speaker = Parse.Object.extend('Speakers');
const Notification = Parse.Object.extend('Notification');
const Map = Parse.Object.extend('Maps');
const Product = Parse.Object.extend('Product');
const Basket = Parse.Object.extend('Basket');
const ProductLine = Parse.Object.extend('ProductLine');

var {nodeInterface, nodeField} = nodeDefinitions(
  findObjectByGlobalId,
  objectToGraphQLType
);

function findObjectByGlobalId(globalId) {
  const {type, id} = fromGlobalId(globalId);
  const Ent = ({Page, FAQ, Session, Speaker, Product, Basket})[type];
  return new Parse.Query(Ent).get(id);
}

function objectToGraphQLType(obj) {
  switch (obj.className) {
    case 'Page':
      return F8PageType;
    case 'Session':
      return F8SessionType;
    case 'Product':
      return F8ProductType;
    case 'Speaker':
      return F8SpeakerType;
    case 'Basket':
      return F8BasketType;
  }
  return null;
}

var USERS_SCHEDULE = {};

var F8FriendType = new GraphQLObjectType({
  name: 'Friend',
  description: 'Facebook friend',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    picture: {
      type: GraphQLString,
      resolve: (friend) => `https://graph.facebook.com/${friend.id}/picture`,
    },
    schedule: {
      type: new GraphQLList(F8SessionType),
      description: 'Friends schedule',
      resolve: (friend, args) => new Parse.Query(Session)
        .containedIn('objectId', Object.keys(friend.schedule))
        .find(),
    },
    favoriteProducts: {
      type: new GraphQLList(F8ProductType),
      description: 'Friends favorite product',
      resolve: (friend, args) => new Parse.Query(Product)
        .containedIn('objectId', Object.keys(friend.product))
        .find(),
    },
  })
});

var F8BasketType = new GraphQLObjectType({
  name: 'Basket',
  description: 'User basket',
  fields: () => ({
    id: globalIdField('Basket'),
    user: {
      type: F8UserType,
      description: 'The user whom this basket belongs to',
      resolve: (basket, args) => new Parse.Query(Parse.User)
        .equalTo('objectId', basket.user)
        .find(),
    },
    productLines: {
      type: new GraphQLList(F8ProductLineType),
      description: 'Basket product lines',
      resolve: (basket, args) => new Parse.Query(ProductLine)
        .containedIn('objectId', Object.keys(basket.productLines))
        .find(),
    },
  }),
  interfaces: [nodeInterface],
});

var F8ProductLineType = new GraphQLObjectType({
  name: 'ProductLine',
  description: 'Basket product line',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    product: {
      type: F8ProductType,
      description: 'The product itself',
      resolve: (productLine) => productLine.get('product')
    },
    amount: {
      type: GraphQLInt,
      description: 'Amount of product',
      resolve: (productLine) => productLine.get('amount')
    },
    giftWrap: {
      type: GraphQLBoolean,
      description: 'Gift wrap the product',
      resolve: (productLine) => productLine.get('giftWrap')
    },
  })
});

function loadFriends(rootValue) {
  return Parse.Cloud.run('friends', {user: rootValue});
}

function loadBasket(rootValue) {
  return Parse.Cloud.run('basket', {user: rootValue});
}

function loadFriendsAttending(rootValue, session) {
  const {id} = session;
  return Parse.Cloud.run('friends', {user: rootValue})
    .then(friends => friends.filter(friend => !!friend.schedule[id]));
}

var F8UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
    },
    friends: {
      type: new GraphQLList(F8FriendType),
      description: 'User friends who are also in the F8 app and enabled sharing',
      resolve: (user, args, {rootValue}) => loadFriends(rootValue),
    },
    basket: {
      type: new GraphQLList(F8BasketType),
      description: 'User basket',
      resolve: (user, args, {rootValue}) => loadBasket(rootValue),
    },
    notifications: {
      type: new GraphQLList(F8NotificationType),
      resolve: () => new Parse.Query(Notification).find(),
    },
    faqs: {
      type: new GraphQLList(F8FAQType),
      resolve: () => new Parse.Query(FAQ).find(),
    },
    pages: {
      type: new GraphQLList(F8PageType),
      resolve: () => new Parse.Query(Page).find(),
    },
    config: {
      type: F8ConfigType,
      resolve: () => Parse.Config.get(),
    }
  }),
  interfaces: [nodeInterface],
});

var F8MapType = new GraphQLObjectType({
  name: 'Map',
  description: 'A place at F8 venue',
  fields: () => ({
    id: globalIdField('Map'),
    name: {
      type: GraphQLString,
      resolve: (map) => map.get('name'),
    },
    map: {
      type: GraphQLString,
      resolve: (map) => map.get('x1') && map.get('x1').url(),
    },
  }),
});

var F8ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'Represents F8 product item',
  fields: () => ({
    id: globalIdField('Product'),
    title: {
      type: GraphQLString,
      resolve: (product) => product.get('title'),
    },
    subTitle: {
      type: GraphQLString,
      resolve: (product) => product.get('subTitle'),
    },
    description: {
      type: GraphQLString,
      resolve: (product) => product.get('description'),
    },
    type: {
      type: GraphQLString,
      resolve: (product) => product.get('type'),
    },
    subType: {
      type: GraphQLString,
      resolve: (product) => product.get('subType'),
    },
    image: {
      type: GraphQLString,
      resolve: (product) => product.get('image') && product.get('image').url(),
    },
    images: {
      type: new GraphQLList(GraphQLString),
      resolve: (product) => product.get('images'),
    },
    discount: {
      type: GraphQLInt,
      resolve: (product) => product.get('discount'),
    },
    price: {
      type: GraphQLInt,
      resolve: (product) => product.get('price'),
    },
  }),
  interfaces: [nodeInterface],
});

var F8SessionType = new GraphQLObjectType({
  name: 'Session',
  description: 'Represents F8 agenda item',
  fields: () => ({
    id: globalIdField('Session'),
    title: {
      type: GraphQLString,
      resolve: (session) => session.get('sessionTitle'),
    },
    slug: {
      type: GraphQLString,
      resolve: (session) => session.get('sessionSlug'),
    },
    day: {
      type: GraphQLInt,
      resolve: (session) => session.get('day'),
    },
    startTime: {
      type: GraphQLFloat,
      resolve: (session) => session.get('startTime').getTime(),
    },
    endTime: {
      type: GraphQLFloat,
      resolve: (session) => session.get('endTime').getTime(),
    },
    location: {
      type: F8MapType,
      resolve: (session) => new Parse.Query(Map).equalTo('name', session.get('sessionLocation')).first(),
    },
    description: {
      type: GraphQLString,
      resolve: (session) => session.get('sessionDescription'),
    },
    speakers: {
      type: new GraphQLList(F8SpeakerType),
      resolve: (session) =>
        Promise.all((session.get('speakers') || []).map(speaker => speaker.fetch())),
    },
    isAdded: {
      type: GraphQLBoolean,
      description: 'If the session has been added to persons schedule',
      resolve: (session, args, {rootValue}) => {
        return !!USERS_SCHEDULE[session.id];
      },
    },
    friends: {
      type: new GraphQLList(F8FriendType),
      description: 'User\'s friends who attend this session',
      resolve: (session, args, {rootValue}) => loadFriendsAttending(rootValue, session),
    },
  }),
  interfaces: [nodeInterface],
});

var F8PageType = new GraphQLObjectType({
  name: 'Page',
  description: 'Facebook pages',
  fields: () => ({
    id: globalIdField('Page'),
    title: {
      type: GraphQLString,
      resolve: (page) => page.get('title'),
    },
    url: {
      type: GraphQLString,
      resolve: (page) => `https://www.facebook.com/${page.get('alias')}`,
    },
    logo: {
      type: GraphQLString,
      resolve: (page) => {
        const logo = page.get('logo');
        if (logo) {
          return logo.url();
        } else {
          return `https://graph.facebook.com/${page.get('alias')}/picture?type=large`;
        }
      }
    }
  }),
  interfaces: [nodeInterface],
});

var F8FAQType = new GraphQLObjectType({
  name: 'FAQ',
  description: 'Frequently asked questions',
  fields: () => ({
    id: globalIdField('FAQ'),
    question: {
      type: GraphQLString,
      resolve: (faq) => faq.get('question'),
    },
    answer: {
      type: GraphQLString,
      resolve: (faq) => faq.get('answer'),
    }
  }),
  interfaces: [nodeInterface],
});

var F8SpeakerType = new GraphQLObjectType({
  name: 'Speaker',
  fields: () => ({
    id: globalIdField('Speaker'),
    name: {
      type: GraphQLString,
      resolve: (speaker) => speaker.get('speakerName'),
    },
    title: {
      type: GraphQLString,
      resolve: (speaker) => speaker.get('speakerTitle'),
    },
    picture: {
      type: GraphQLString,
      resolve: (speaker) => speaker.get('speakerPic') && speaker.get('speakerPic').url(),
    }
  }),
  interfaces: [nodeInterface],
});

var F8NotificationType = new GraphQLObjectType({
  name: 'Notification',
  fields: () => ({
    id: globalIdField('Notification'),
    text: {
      type: GraphQLString,
      resolve: (notification) => notification.get('text'),
    },
    url: {
      type: GraphQLString,
      resolve: (notification) => notification.get('url'),
    },
    time: {
      type: GraphQLFloat,
      description: 'Unix timestamp when the notification was sent.',
      resolve: (notification) => notification.get('createdAt').getTime(),
    }
  }),
});

var F8ConfigType = new GraphQLObjectType({
  name: 'Config',
  fields: () => ({
    wifiNetwork: {
      type: GraphQLString,
      resolve: (config) => config.get('wifiNetwork'),
    },
    wifiPassword: {
      type: GraphQLString,
      resolve: (config) => config.get('wifiPassword'),
    },
  }),
});

var F8QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    viewer: {
      type: F8UserType,
      resolve: (rootValue) => rootValue, // TODO: Authenticate user
    },
    schedule: {
      type: new GraphQLList(F8SessionType),
      description: 'F8 agenda',
      resolve: (user, args) => new Parse.Query(Session)
        .ascending('startTime')
        .find(),
    },
    products: {
      type: new GraphQLList(F8ProductType),
      description: 'F8 products',
      resolve: (user, args) => new Parse.Query(Product)
        .find(),
    },
    baskets: {
      type: new GraphQLList(F8BasketType),
      description: 'F8 baskets',
      resolve: (user, args) => new Parse.Query(Basket)
        .include('user')
        .include('productLines')
        .find(),
    },
  }),
});

var addToScheduleMutation = mutationWithClientMutationId({
  name: 'AddToSchedule',
  inputFields: {
    sessionId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    session: {
      type: F8SessionType,
      resolve: (payload) => new Parse.Query(Session).get(payload.id),
    },
  },
  mutateAndGetPayload: ({sessionId}, {rootValue}) => {
    const {type, id} = fromGlobalId(sessionId);
    if (type !== 'Session') {
      throw new Error(`Invalid type ${type}`);
    }
    USERS_SCHEDULE[id] = true;
    console.log(`Mutate ${id}`, rootValue);
    return {id};
  },
});

var addToBasketMutation = mutationWithClientMutationId({
  name: 'AddToBasket',
  inputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    productId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    amount: {
      type: GraphQLInt,
    },
    giftWrap: {
      type: GraphQLBoolean,
    },
  },
  outputFields: {
    productLine: {
      type: F8ProductLineType,
      resolve: (payload) => new Parse.Query(ProductLine).get(payload.id),
    },
  },
  mutateAndGetPayload: ({userId, productId, amount, giftWrap}, {rootValue}) => {
    const {type, id} = fromGlobalId(productId);
    if (type !== 'Product') {
      throw new Error(`Invalid type ${type}`);
    }
    console.log(`Mutate ${id}`, rootValue);

    return new Promise((resolve) => {
      const productLine = new Parse.Object(ProductLine);
      productLine.set('product', productId);
      productLine.set('amount', amount);
      productLine.set('giftWrap', giftWrap);

      productLine
        .save()
        .then(() => {
          const basket = new Parse.Query(Basket)
            .equalTo('user', userId)
            .limit(1)
            .find();

          basket.add('productLines', productLine);
          console.log('Mutate end', productLine, basket);
          resolve(productLine);
        });
    });
  },
});

var F8MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
    addToSchedule: addToScheduleMutation,
    addToBasket: addToBasketMutation
  })
});

export var Schema = new GraphQLSchema({
  query: F8QueryType,
  mutation: F8MutationType,
});
