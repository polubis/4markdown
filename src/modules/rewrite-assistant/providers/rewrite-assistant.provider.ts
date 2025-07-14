import { context } from "@greenonsoftware/react-kit";
import {
  type RewriteAssistantState,
  type RewriteAssistantAction,
  type RewriteAssistantProps,
} from "../models";
import { suid } from "development-kit/suid";
import React, { type Reducer } from "react";
import { type RewriteAssistantPersona } from "api-4markdown-contracts";
import { rewriteWithAssistantAct } from "acts/rewrite-with-assistant.act";
import { from, Subject, switchMap, takeUntil } from "rxjs";
import { REWRITE_ASSISTANT_TRANSLATIONS } from "../config/translations";

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
            content: REWRITE_ASSISTANT_TRANSLATIONS[action.payload].message,
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
            content: `Here is an assistant's answer`,
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
            content: `Try again`,
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

    const [askSubject] = React.useState(
      () =>
        new Subject<{
          persona: RewriteAssistantPersona;
          content: RewriteAssistantProps["content"];
        }>(),
    );
    const [cancelSubject] = React.useState(() => new Subject<void>());

    const dispatchMiddleware = (action: RewriteAssistantAction): void => {
      switch (action.type) {
        case `ASK_AGAIN`: {
          cancelSubject.next();
          askSubject.next({ persona: action.payload, content });
          break;
        }
        case `STOP`: {
          cancelSubject.next();
          break;
        }
        case `SELECT_PERSONA`: {
          askSubject.next({ persona: action.payload, content });
          break;
        }
        case `RESET`: {
          cancelSubject.next();
          break;
        }
        case `CLOSE`: {
          cancelSubject.next();
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

    React.useEffect(() => {
      const askSubscription = askSubject
        .pipe(
          switchMap(({ persona, content }) =>
            from(
              rewriteWithAssistantAct({
                persona,
                input: content,
              }),
            ).pipe(takeUntil(cancelSubject)),
          ),
        )
        .subscribe({
          next: (response) => {
            if (response.is === `ok`) {
              dispatch({ type: `AS_OK`, payload: response.data.output });
            } else {
              dispatch({ type: `AS_FAIL`, payload: response.error });
            }
          },
        });

      return () => {
        askSubscription.unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
      state,
      content,
      dispatch: dispatchMiddleware,
    };
  },
);

export { RewriteAssistantProvider, useRewriteAssistantContext };
