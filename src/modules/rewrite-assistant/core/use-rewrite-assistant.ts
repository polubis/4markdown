import React, { type Reducer } from 'react';
import {
  type RewriteAssistantState,
  type RewriteAssistantAction,
  REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS,
} from '../models';
import { suid } from 'development-kit/suid';

const initialState: RewriteAssistantState = {
  operation: { is: `idle` },
  messages: [],
  activePersona: `none`,
};

const reducer: Reducer<RewriteAssistantState, RewriteAssistantAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case `reset`:
      return initialState;
    case `select-persona`:
      return {
        ...state,
        activePersona: action.payload,
        operation: { is: `busy` },
        messages: [
          ...state.messages,
          {
            id: suid(),
            type: `user-input`,
            content: `Please rewrite me selected fragment. Be ${REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS[action.payload]}`,
          },
        ],
      };
    case `set-ok`:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: suid(),
            type: `system-info`,
            content: `Here is an improved version of the fragment`,
          },
          {
            id: suid(),
            type: `assistant-output`,
            content: action.payload,
          },
        ],
        operation: { is: `ok` },
      };
    case `set-fail`:
      return {
        ...state,
        operation: { is: `fail`, error: action.payload },
      };
    default:
      return state;
  }
};

const useRewriteAssistant = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return { state, dispatch };
};

export { useRewriteAssistant };
