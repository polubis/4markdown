import { state } from 'development-kit/state';
import type { MindmapCreatorState } from './models';

const useMindmapCreatorState = state<MindmapCreatorState>({
  orientation: `y`,
  nodes: [],
  edges: [],
  nodeForm: { is: `closed` },
  nodesRemovalConfirmation: { is: `closed` },
  mindmapForm: { is: `closed` },
  activeMindmapId: null,
  mindmaps: { is: `idle` },
  yourMindmapsView: { is: `closed` },
});

export { useMindmapCreatorState };
