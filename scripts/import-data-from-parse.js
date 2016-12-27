import fetch from 'isomorphic-fetch';
import Parse from 'parse/node';

const SERVER_PORT = process.env.PORT || 8080;

Parse.initialize('oss-f8-app-2016');
Parse.serverURL = `http://localhost:${SERVER_PORT}/parse`;

const BLACKLISTED_KEYS = new Set(['objectId', 'createdAt', 'updatedAt']);
const ID_MAP = new Map();

function convertPointer(pointer) {
  if (pointer.__type === 'Pointer') {
    return {...pointer, objectId: ID_MAP.get(pointer.objectId) || pointer.objectId};
  }
  return pointer;
}

async function importObject(ClassType, attributes) {
  let obj = new ClassType();
  for (let key in attributes) {
    if (BLACKLISTED_KEYS.has(key)) {
      continue;
    }
    let value = attributes[key];
    if (Array.isArray(value)) {
      value = value.map(convertPointer);
    }
    obj.set(key, value);
  }
  obj = await obj.save();
  ID_MAP.set(attributes.objectId, obj.id);
  return obj;
}

async function importClass(className) {
  console.log('Loading', className);
  const response = await fetch(`https://api.parse.com/1/classes/${className}`, {
    method: 'get',
    headers: {
      'X-Parse-Application-Id': 'R0yDMIKCUyEke2UiadcTBBGd1L5hMBTGJSdBNL3W',
      'X-Parse-JavaScript-Key': 'BJ5V0APFMlvmCBPDXl9Mgh3q3dFrs18XkQz6A2bO',
      'Content-Type': 'application/json'
    },
  });
  const {results} = await response.json();
  const ClassType = Parse.Object.extend(className);
  console.log('Cleaning old', className, 'data');
  await new Parse.Query(ClassType)
    .each(record => record.destroy());
  console.log('Converting', className);
  return Promise.all(results.map(attrs => importObject(ClassType, attrs)));
}

var Survey = Parse.Object.extend('Survey');

async function createSurvey(session) {
  return await new Survey({
    session: session,
    q1: 'How useful did you find the content from this session?',
    q2: 'How likely are you to implement the products/techniques covered in this session?',
  }).save();
}

async function main() {
  await importClass('Speakers');
  var sessions = await importClass('Agenda');

  console.log('Generating sample survey questions');
  await new Parse.Query(Survey)
    .each(record => record.destroy());
  await sessions.map(s => s.get('hasDetails') ? createSurvey(s) : Promise.resolve(null));

  await Promise.all([
    importClass('FAQ'),
    importClass('Maps'),
    importClass('Notification'),
    importClass('Page'),
  ]);
  return 'OK';
}

main()
  .then(console.dir, console.error);
