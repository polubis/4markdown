import type { DocumentNode } from 'api-4markdown-contracts';

type DocumentNodeViewModel = DocumentNode & { selected: boolean };

export type { DocumentNodeViewModel };
