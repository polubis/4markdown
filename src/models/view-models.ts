import type {
  PermanentDocumentDto,
  PrivateDocumentDto,
  PublicDocumentDto,
} from 'api-4markdown-contracts';

type DocumentCreatorViewModel = {
  document:
    | PrivateDocumentDto
    | Omit<PublicDocumentDto, 'author' | 'rating'>
    | Omit<PermanentDocumentDto, 'author' | 'rating'>;
};

export type { DocumentCreatorViewModel };
