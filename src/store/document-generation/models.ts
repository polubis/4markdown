import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  ParsedError,
} from 'api-4markdown-contracts';
import type { SUID } from 'development-kit/suid';
import type { Prettify } from 'development-kit/utility-types';

type History = ({ id: SUID } & (
  | {
      type: `user`;
      message: string;
      payload: API4MarkdownPayload<'createContentWithAI'>;
    }
  | {
      type: `assistant`;
      message: string;
      body: API4MarkdownDto<'createContentWithAI'>;
    }
  | { type: `system`; message: string }
))[];

type Conversation = Prettify<{
  history: History;
  opened: boolean;
  operation:
    | { is: `idle` }
    | { is: `busy` }
    | { is: `ok` }
    | { is: `fail`; error: ParsedError };
  id: SUID;
}>;

type DocumentGenerationState = {
  conversations: Conversation[];
};

export type { DocumentGenerationState };
