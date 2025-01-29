import type { Mindmap, MindmapNode } from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type MindmapCreatorState = Transaction<{
  activeMindmap: Mindmap;
  browsedMindmaps: Mindmap[];
  activeMindmapNode: MindmapNode | null;
}>;

type MindmapCreatorOkState = Extract<MindmapCreatorState, { is: `ok` }>;

export type { MindmapCreatorState, MindmapCreatorOkState };
