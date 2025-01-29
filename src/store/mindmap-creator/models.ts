import type {
  DocumentNode,
  EmbeddedNode,
  Mindmap,
} from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type MindmapCreatorState = Transaction<{
  activeMindmap: Mindmap;
  browsedMindmaps: Mindmap[];
  activeMindmapNode: DocumentNode | EmbeddedNode | null;
}>;

type MindmapCreatorOkState = Extract<MindmapCreatorState, { is: `ok` }>;

export type { MindmapCreatorState, MindmapCreatorOkState };
