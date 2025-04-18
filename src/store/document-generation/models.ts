import type { API4MarkdownPayload, ParsedError } from 'api-4markdown-contracts';
import type { SUID } from 'development-kit/suid';
import type { Prettify } from 'development-kit/utility-types';

type History = ({ id: SUID } & (
  | {
      type: `user-started`;
      message: string;
      payload: API4MarkdownPayload<'createContentWithAI'>;
    }
  | { type: `user`; message: string }
  | { type: `assistant`; message: string }
))[];

type Conversation = Prettify<{
  payload: API4MarkdownPayload<'createContentWithAI'>;
  history: History;
  opened: boolean;
  operation:
    | { is: `busy` }
    | { is: `ok` }
    | { is: `stopped` }
    | { is: `fail`; error: ParsedError };
  id: SUID;
}>;

type DocumentGenerationState = {
  conversations: Conversation[];
};

export type { DocumentGenerationState };
