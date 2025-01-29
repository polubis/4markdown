import type { DocumentNode, ExternalNode } from 'api-4markdown-contracts';

type DocumentNodeViewModel = DocumentNode & { selected: boolean };
type ExternalNodeViewModel = ExternalNode & { selected: boolean };

export type { DocumentNodeViewModel, ExternalNodeViewModel };
