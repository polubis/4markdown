import { state } from 'development-kit/state';
import type { MindmapCreatorState } from './models';
import { type Viewport } from '@xyflow/react';

let lastViewport: Viewport;

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

const setLastViewport = (viewport: Viewport): void => {
  lastViewport = viewport;
};

const getLastViewport = () => lastViewport;

export { useMindmapCreatorState, setLastViewport, getLastViewport };
