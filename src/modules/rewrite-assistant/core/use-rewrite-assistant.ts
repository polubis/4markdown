import React, { type Reducer } from 'react';
import {
  type RewriteAssistantState,
  type RewriteAssistantAction,
  REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS,
} from '../models';
import { suid } from 'development-kit/suid';
import { parseError } from 'api-4markdown';

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
    case `ask-again`:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: suid(),
            type: `user-input`,
            content: `Give me other variant of the fragment. Be ${REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS[action.payload]}`,
          },
        ],
        operation: { is: `busy` },
      };
    case `set-fail`:
      return {
        ...state,
        operation: { is: `fail`, error: action.payload },
      };
    case `set-stopped`:
      return {
        ...state,
        operation: { is: `stopped` },
      };
    default:
      return state;
  }
};

const useRewriteAssistantState = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const askAssistant = async (): Promise<void> => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      abortControllerRef.current = new AbortController();

      const responseContent = await new Promise<string>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const response = await fetch(`/intro.md`, {
              signal: abortControllerRef.current?.signal,
            });
            const content = await response.text();
            return resolve(content);
          } catch (error: unknown) {
            if (error instanceof Error && error.name === `AbortError`) {
              return;
            }
            return reject(error);
          }
        }, 1000);
      });

      dispatch({ type: `set-ok`, payload: responseContent });
    } catch (error) {
      if (error instanceof Error && error.name !== `AbortError`) {
        dispatch({ type: `set-fail`, payload: parseError(error) });
      }
    }
  };

  const dispatchMiddleware = (action: RewriteAssistantAction): void => {
    dispatch(action);

    switch (action.type) {
      case `select-persona`:
      case `ask-again`: {
        askAssistant();
        break;
      }
      case `set-stopped`: {
        abortControllerRef.current?.abort();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        break;
      }
    }
  };

  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  return [state, dispatchMiddleware] as const;
};

export { useRewriteAssistantState };
