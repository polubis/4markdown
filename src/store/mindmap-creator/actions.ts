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
import { defaultMindmap } from './config';

const { set, get } = useMindmapCreatorState;

const getOkState = (): MindmapCreatorOkState => mindmapReadySelector(get());

const updateNodesAction = (changes: NodeChange[]): void => {
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      nodes: applyNodeChanges(changes, activeMindmap.nodes) as Mindmap['nodes'],
    },
  });
};

const updateEdgesAction = (changes: EdgeChange[]): void => {
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      edges: applyEdgeChanges(changes, activeMindmap.edges) as Mindmap['edges'],
    },
  });
};

const connectNodesAction = ({ source, target }: Connection): void => {
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      edges: [
        ...activeMindmap.edges,
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
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      edges: activeMindmap.edges.filter((edge) => edge.id !== id),
    },
  });
};

const toggleMindmapNodeAction = (id: MindmapNode['id'] | null): void => {
  if (!id) {
    set({ activeMindmapNode: null });
    return;
  }

  const { activeMindmap } = getOkState();

  const activeMindmapNode = activeMindmap.nodes.find((node) => node.id === id);

  if (!activeMindmapNode) {
    set({ activeMindmapNode: null });
    return;
  }

  if (
    activeMindmapNode.type === `external` ||
    activeMindmapNode.type === `nested`
  ) {
    set({ activeMindmapNode: null });
    return;
  }

  set({ activeMindmapNode });
};

const openNestedMindmapAction = (id: Mindmap['id']): void => {
  console.log(id);
  set({ browsedMindmaps: [defaultMindmap] });
};

export {
  updateNodesAction,
  updateEdgesAction,
  connectNodesAction,
  removeNodesConnectionAction,
  toggleMindmapNodeAction,
  openNestedMindmapAction,
};
