import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import { useMindmapCreatorState } from '.';
import { mindmapReadySelector } from './selectors';
import type { Mindmap, MindmapNode } from 'api-4markdown-contracts';
import type { MindmapCreatorOkState } from './models';

const { set, get } = useMindmapCreatorState;

const getOkState = (): MindmapCreatorOkState => mindmapReadySelector(get());

const updateNodesAction = (changes: NodeChange[]): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      nodes: applyNodeChanges(changes, mindmap.nodes) as Mindmap['nodes'],
    },
  });
};

const updateEdgesAction = (changes: EdgeChange[]): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      edges: applyEdgeChanges(changes, mindmap.edges) as Mindmap['edges'],
    },
  });
};

const connectNodesAction = ({ source, target }: Connection): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      edges: [
        ...mindmap.edges,
        {
          id: new Date().toISOString(),
          type: `unvisited`,
          source,
          target,
        },
      ],
    },
  });
};

const removeNodesConnectionAction = (id: MindmapNode['id']): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      edges: mindmap.edges.filter((edge) => edge.id !== id),
    },
  });
};

const toggleMindmapNodeAction = (id: MindmapNode['id'] | null): void => {
  if (!id) {
    set({ activeMindmapNode: null });
    return;
  }

  const { mindmap } = getOkState();

  const activeMindmapNode =
    mindmap.nodes.find((node) => node.id === id) ?? null;

  set({ activeMindmapNode });
};

export {
  updateNodesAction,
  updateEdgesAction,
  connectNodesAction,
  removeNodesConnectionAction,
  toggleMindmapNodeAction,
};
