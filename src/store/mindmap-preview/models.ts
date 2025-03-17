import type { API4MarkdownDto } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type MindmapPreviewState = Transaction<{
  mindmap: API4MarkdownDto<`getMindmap`>;
}>;

export type { MindmapPreviewState };
