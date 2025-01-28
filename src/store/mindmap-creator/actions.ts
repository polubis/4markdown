import {
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import { useMindmapCreatorState } from '.';
import { mindmapReadySelector } from './selectors';
import type { Mindmap } from 'api-4markdown-contracts';
import type { MindmapCreatorOkState } from './models';

const getOkState = (): MindmapCreatorOkState =>
  mindmapReadySelector(useMindmapCreatorState.get());

const updateNodesAction = (changes: NodeChange[]): void => {
  const { mindmap } = getOkState();

  useMindmapCreatorState.set({
    mindmap: {
      ...mindmap,
      nodes: applyNodeChanges(changes, mindmap.nodes) as Mindmap['nodes'],
    },
  });
};

const updateEdgesAction = (changes: EdgeChange[]): void => {
  const { mindmap } = getOkState();

  useMindmapCreatorState.set({
    mindmap: {
      ...mindmap,
      edges: applyEdgeChanges(changes, mindmap.edges) as Mindmap['edges'],
    },
  });
};

export { updateNodesAction, updateEdgesAction };
