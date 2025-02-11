import type {
  DocumentNode,
  EmbeddedNode,
  MindmapDto,
} from 'api-4markdown-contracts';

type StateBase = {
  activeMindmap: MindmapDto;
  activeMindmapNode: DocumentNode | EmbeddedNode | null;
  savingDisabled: boolean;
};

type MindmapCreatorState = { is: `unset` } | ({ is: `active` } & StateBase);

type MindmapCreatorActiveState = Extract<MindmapCreatorState, { is: `active` }>;

export type { MindmapCreatorState, MindmapCreatorActiveState };
