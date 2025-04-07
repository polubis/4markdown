import { context } from '@greenonsoftware/react-kit';
import {
  type RewriteAssistantState,
  type RewriteAssistantAction,
  REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS,
  type RewriteAssistantProps,
} from '../models';
import { suid } from 'development-kit/suid';
import React, { type Reducer } from 'react';
import { type RewriteAssistantPersona } from 'api-4markdown-contracts';
import { rewriteWithAssistantAct } from 'acts/rewrite-with-assistant.act';

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
    case `RESET`:
      return initialState;
    case `SELECT_PERSONA`:
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
    case `AS_OK`:
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
    case `ASK_AGAIN`:
      return {
        ...state,
        messages: [
          ...state.messages.filter(
            (message) => message.type !== `system-error`,
          ),
          {
            id: suid(),
            type: `user-input`,
            content: `Give me other variant of the fragment. Be ${REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS[action.payload]}`,
          },
        ],
        operation: { is: `busy` },
      };
    case `AS_FAIL`:
      return {
        ...state,
        operation: { is: `fail`, error: action.payload },
        messages: [
          ...state.messages,
          {
            id: suid(),
            type: `system-error`,
            content: action.payload.message,
          },
        ],
      };
    case `STOP`:
      return {
        ...state,
        operation: { is: `stopped` },
        messages: [
          ...state.messages,
          {
            id: suid(),
            type: `system-info`,
            content: `Operation stopped`,
          },
        ],
      };
    default:
      return state;
  }
};

const [RewriteAssistantProvider, useRewriteAssistantContext] = context(
  ({ content, onClose, onApply }: RewriteAssistantProps) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const askAssistant = async (
      persona: RewriteAssistantPersona,
    ): Promise<void> => {
      const response = await rewriteWithAssistantAct({
        persona,
        input: content,
      });

      if (response.is === `ok`) {
        dispatch({ type: `AS_OK`, payload: response.data.output });
      } else {
        dispatch({ type: `AS_FAIL`, payload: response.error });
      }
    };

    const dispatchMiddleware = (action: RewriteAssistantAction): void => {
      switch (action.type) {
        case `ASK_AGAIN`: {
          askAssistant(action.payload);
          break;
        }
        case `STOP`: {
          break;
        }
        case `SELECT_PERSONA`: {
          askAssistant(action.payload);
          break;
        }
        case `CLOSE`: {
          onClose();
          break;
        }
        case `APPLY`: {
          onApply(action.payload);
          break;
        }
      }

      dispatch(action);
    };

    return {
      state,
      content,
      dispatch: dispatchMiddleware,
    };
  },
);

export { RewriteAssistantProvider, useRewriteAssistantContext };
