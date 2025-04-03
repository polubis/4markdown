import { context } from '@greenonsoftware/react-kit';
import {
  type RewriteAssistantState,
  type RewriteAssistantAction,
  REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS,
} from '../models';
import { suid } from 'development-kit/suid';
import { parseError } from 'api-4markdown';
import React, { type Reducer } from 'react';

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
  ({
    content,
    onClose,
    onApply,
  }: {
    content: string;
    onClose(): void;
    onApply(payload: string): void;
  }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const abortControllerRef = React.useRef<AbortController | null>(null);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const skipCurrentRequest = (): void => {
      abortControllerRef.current?.abort();
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };

    const askAssistant = async (): Promise<void> => {
      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch(`/intro.md`, {
          signal: abortControllerRef.current?.signal,
        });
        const responseContent = await response.text();

        dispatch({ type: `AS_OK`, payload: responseContent.slice(0, 100) });
      } catch (error) {
        if (error instanceof Error && error.name !== `AbortError`) {
          dispatch({ type: `AS_FAIL`, payload: parseError(error) });
        }
      }
    };

    const dispatchMiddleware = (action: RewriteAssistantAction): void => {
      switch (action.type) {
        case `ASK_AGAIN`: {
          skipCurrentRequest();
          askAssistant();
          break;
        }
        case `STOP`: {
          skipCurrentRequest();
          break;
        }
        case `SELECT_PERSONA`: {
          skipCurrentRequest();
          askAssistant();
          break;
        }
        case `RESET`: {
          skipCurrentRequest();
          break;
        }
        case `CLOSE`: {
          skipCurrentRequest();
          onClose();
          break;
        }
        case `APPLY`: {
          skipCurrentRequest();
          onApply(action.payload);
          break;
        }
      }

      dispatch(action);
    };

    React.useEffect(() => {
      return () => {
        skipCurrentRequest();
      };
    }, []);

    return {
      state,
      content,
      dispatch: dispatchMiddleware,
    };
  },
);

export { RewriteAssistantProvider, useRewriteAssistantContext };
