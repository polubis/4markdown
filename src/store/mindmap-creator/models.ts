import type { Mindmap } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type MindmapCreatorState = Transaction<{
  mindmap: Mindmap;
}>;

type MindmapCreatorOkState = Extract<MindmapCreatorState, { is: `ok` }>;

export type { MindmapCreatorState, MindmapCreatorOkState };
