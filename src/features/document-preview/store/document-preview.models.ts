import type {
  PermanentDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';
import type { ParsedError } from 'development-kit/parse-error-v2';
import type { Transaction } from 'development-kit/utility-types';

type DocumentPreviewStoreState = Transaction<
  {
    document: PublicDocumentDto | PermanentDocumentDto;
  },
  { error: ParsedError }
>;

export type { DocumentPreviewStoreState };
