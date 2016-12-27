/**
 * @flow
 */

'use strict';

const createParseReducer = require('./createParseReducer');

export type Speaker = {
  id: string;
  bio: string;
  name: string;
  pic: string;
  title: string;
};

export type Session = {
  id: string;
  day: number;
  allDay: boolean;
  title: string;
  description: string;
  hasDetails: boolean;
  slug: string;
  speakers: Array<Speaker>;
  onMySchedule: boolean;
  tags: Array<string>;
  startTime: number;
  endTime: number;
  map: ?string;
  location: ?string;
};

function fromParseSpeaker(speaker: Object): Speaker {
  var pic = speaker.get('speakerPic');
  return {
    id: speaker.id,
    bio: speaker.get('speakerBio'),
    name: speaker.get('speakerName'),
    pic: pic && pic.url(),
    title: speaker.get('speakerTitle'),
  };
}

function fromParseSessions(session: Object): Session {
  return {
    id: session.id,
    day: session.get('day'),
    allDay: session.get('allDay'),
    title: session.get('sessionTitle'),
    description: session.get('sessionDescription'),
    hasDetails: session.get('hasDetails'),
    slug: session.get('sessionSlug'),
    speakers: (session.get('speakers') || []).map(fromParseSpeaker),
    onMySchedule: session.get('onMySchedule'),
    tags: session.get('tags') || [],
    startTime: session.get('startTime') && session.get('startTime').getTime(),
    endTime: session.get('endTime') && session.get('endTime').getTime(),
    map: session.get('sessionMap') && session.get('sessionMap').url(),
    location: session.get('sessionLocation'),
  };
}

module.exports = createParseReducer('LOADED_SESSIONS', fromParseSessions);
