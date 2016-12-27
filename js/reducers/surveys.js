/**
 * @flow
 */

'use strict';

import type {Action} from '../actions/types';

export type Question = {
  text: string;
  lowLabel: string;
  highLabel: string;
};

export type Survey = {
  id: string;
  productId: string;
  questions: Array<Question>;
};

type State = Array<Survey>;

function surveys(state: State = [], action: Action): State {
  if (action.type === 'LOADED_SURVEYS') {
    return action.list.filter(s => !!s.productId);
  }
  if (action.type === 'SUBMITTED_SURVEY_ANSWERS') {
    const submittedSurveyId = action.id;
    return state.filter((survey) => survey.id !== submittedSurveyId).filter(s => !!s.productId);
  }
  if (action.type === 'LOGGED_OUT') {
    return [];
  }
  return state;
}

module.exports = surveys;
