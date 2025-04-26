import type {
  RewriteAssistantPersona,
  ParsedError,
} from 'api-4markdown-contracts';
import type { SUID } from 'development-kit/suid';

type RewriteAssistantOperation =
  | { is: `idle` }
  | { is: `busy` }
  | { is: `ok` }
  | { is: `stopped` }
  | { is: `fail`; error: ParsedError };

type RewriteAssistantMessage = {
  id: SUID;
  type: `user-input` | `assistant-output` | `system-info` | `system-error`;
  content: string;
};

type RewriteAssistantState = {
  operation: RewriteAssistantOperation;
  messages: RewriteAssistantMessage[];
  activePersona: RewriteAssistantPersona | `none`;
};

type RewriteAssistantAction =
  | { type: 'RESET' }
  | {
      type: 'SELECT_PERSONA';
      payload: RewriteAssistantPersona;
    }
  | {
      type: 'AS_OK';
      payload: RewriteAssistantMessage['content'];
    }
  | { type: `AS_FAIL`; payload: ParsedError }
  | { type: `STOP` }
  | {
      type: `ASK_AGAIN`;
      payload: RewriteAssistantPersona;
    }
  | { type: `CLOSE` }
  | { type: `APPLY`; payload: string };

type RewriteAssistantProps = {
  content: string;
  onClose(): void;
  onApply(content: string): void;
};

export type {
  RewriteAssistantState,
  RewriteAssistantMessage,
  RewriteAssistantOperation,
  RewriteAssistantAction,
  RewriteAssistantProps,
};
