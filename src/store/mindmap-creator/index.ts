import { state } from 'development-kit/state';
import type { MindmapCreatorState } from './models';
import { type Viewport } from '@xyflow/react';

type LastViewport = Viewport & { width: number; height: number };

let lastViewport: LastViewport;

const useMindmapCreatorState = state<MindmapCreatorState>({
  orientation: `y`,
  nodes: [],
  changesCount: 0,
  edges: [],
  nodeForm: { is: `closed` },
  nodesRemovalConfirmation: { is: `closed` },
  mindmapForm: { is: `closed` },
  activeMindmapId: null,
  mindmaps: { is: `idle` },
  yourMindmapsView: { is: `closed` },
  nodePreview: { is: `closed` },
  operation: { is: `idle` },
  mindmapDetails: { is: `off` },
});

const setLastViewport = (viewport: LastViewport): void => {
  lastViewport = viewport;
};

const getLastViewport = () => lastViewport;

export { useMindmapCreatorState, setLastViewport, getLastViewport };
