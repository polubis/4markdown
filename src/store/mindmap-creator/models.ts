import type {
  DocumentNode,
  EmbeddedNode,
  MindmapDto,
} from 'api-4markdown-contracts';
import type { Transaction } from 'development-kit/utility-types';

type MindmapCreatorState = Transaction<{
  activeMindmap: MindmapDto;
  initialMindmap: MindmapDto;
  browsedMindmaps: MindmapDto[];
  activeMindmapNode: DocumentNode | EmbeddedNode | null;
  updating: Transaction;
}>;

type MindmapCreatorOkState = Extract<MindmapCreatorState, { is: `ok` }>;

export type { MindmapCreatorState, MindmapCreatorOkState };
