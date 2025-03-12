import type { DocumentDto } from 'api-4markdown-contracts';

type MetadataState = {
  documentCode: DocumentDto['code'] | null;
};

export type { MetadataState };
