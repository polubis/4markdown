import type {
  API4MarkdownDto,
  DocumentDto,
  ParsedError,
} from 'api-4markdown-contracts';

type DocumentsCreatorState = {
  changed: boolean;
  code: DocumentDto['code'];
  initialCode: DocumentDto['code'];
  display: `both` | `code` | `preview`;
  activeDocumentId: DocumentDto['id'] | null;
  documents: API4MarkdownDto<`getYourDocuments`>;
  busy: boolean;
  error: ParsedError | null;
};

export type { DocumentsCreatorState };
