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
  type: `user-input` | `assistant-output` | `system-info`;
  content: string;
};

type RewriteAssistantState = {
  operation: RewriteAssistantOperation;
  messages: RewriteAssistantMessage[];
  activePersona: RewriteAssistantPersona | `none`;
};

type RewriteAssistantAction =
  | { type: 'reset' }
  | { type: 'select-persona'; payload: RewriteAssistantPersona }
  | {
      type: 'set-ok';
      payload: RewriteAssistantMessage['content'];
    }
  | { type: `set-fail`; payload: ParsedError };

type RewriteAssistantProps = {
  content: string;
  onClose(): void;
};

const REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS = {
  jelly: `casual, straight to the point`,
  kate: `technical, detailed, rich`,
  josh: `edgy, sarcastic, funny`,
} satisfies Record<RewriteAssistantPersona, string>;

export { REWRITE_ASSISTANT_PERSONA_DESCRIPTIONS };
export type {
  RewriteAssistantState,
  RewriteAssistantMessage,
  RewriteAssistantOperation,
  RewriteAssistantAction,
  RewriteAssistantProps,
};
