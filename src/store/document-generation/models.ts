import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  ParsedError,
} from 'api-4markdown-contracts';
import type { SUID } from 'development-kit/suid';
import type { Prettify } from 'development-kit/utility-types';

type History = ({ id: SUID } & (
  | {
      type: `user-started`;
      message: string;
    }
  | { type: `user-asked`; message: string }
  | {
      type: `assistant-reply`;
      message: string;
      body: API4MarkdownDto<'createContentWithAI'>;
    }
  | { type: `system-message`; message: string }
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
