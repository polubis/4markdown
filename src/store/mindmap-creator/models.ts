import type {
  DocumentNode,
  EmbeddedNode,
  MindmapDto,
  ParsedError,
} from 'api-4markdown-contracts';

type StateBase = {
  activeMindmap: MindmapDto;
  activeMindmapNode: DocumentNode | EmbeddedNode | null;
  saving: boolean;
  error: null | ParsedError;
};

type MindmapCreatorState = { is: `unset` } | ({ is: `active` } & StateBase);

type MindmapCreatorActiveState = Extract<MindmapCreatorState, { is: `active` }>;

export type { MindmapCreatorState, MindmapCreatorActiveState };
