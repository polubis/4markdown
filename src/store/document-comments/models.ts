import type { DocumentCommentDto } from 'api-4markdown-contracts';
import { type Transaction } from 'development-kit/utility-types';

type DocumentCommentsState = {
  comments: Transaction<{ data: DocumentCommentDto[] }>;
  updating: Transaction;
};

export type { DocumentCommentsState };
