/**
 * @flow
 */

'use strict';

const Parse = require('parse/react-native');

import type { Action } from './types';

async function loadSurveys(): Promise<Action> {
  const list = await Parse.Cloud.run('surveys');
  return {
    type: 'LOADED_SURVEYS',
    list,
  };
}

async function submitSurveyAnswers(id: string, answers: Array<any>): Promise<Action> {
  await Parse.Cloud.run('submit_survey', {id, answers});
  return {
    type: 'SUBMITTED_SURVEY_ANSWERS',
    id,
  };
}

module.exports = {
  loadSurveys,
  submitSurveyAnswers,
};
