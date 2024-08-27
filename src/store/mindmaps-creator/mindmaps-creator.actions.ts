import {
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type Connection,
  type NodeChange,
} from '@xyflow/react';
import { useMindmapsCreatorStore } from './mindmaps-creator.store';
import type {
  MindmapEdge,
  MindmapInternalNode,
  MindmapNode,
} from 'api-4markdown-contracts';

const { getState: get, setState: set } = useMindmapsCreatorStore;

const connectMindmap = ({ source, target }: Connection): void => {
  const { mindmap } = get();

  set({
    mindmap: {
      ...mindmap,
      edges: [
        ...mindmap.edges,
        {
          id: `e${source}-${target}`,
          source,
          target,
          type: `basic`,
        },
      ],
    },
  });
};
// @TODO[PRIO=4]: [Make it better typed].
const updateMindmapNodes = (changes: NodeChange[]): void => {
  const { mindmap } = get();

  set({
    mindmap: {
      ...mindmap,
      nodes: applyNodeChanges(changes, mindmap.nodes) as MindmapNode[],
    },
  });
};

const updateMindmapEdges = (changes: EdgeChange[]): void => {
  const { mindmap } = get();

  set({
    mindmap: {
      ...mindmap,
      edges: applyEdgeChanges(changes, mindmap.edges) as MindmapEdge[],
    },
  });
};

const cancelAddingNode = (): void => {
  set({
    nodeForm: {
      opened: false,
    },
  });
};

const addInternalMindmapNode = (data: MindmapInternalNode['data']): void => {
  const { mindmap } = get();

  set({
    mindmap: {
      ...mindmap,
      nodes: [
        ...mindmap.nodes,
        {
          id: new Date().toISOString(),
          position: {
            x: 0,
            y: 0,
          },
          data,
          type: `internal`,
        },
      ],
    },
    nodeForm: {
      opened: false,
    },
  });
};

const startAddingNode = (): void => {
  set({
    nodeForm: {
      opened: true,
    },
  });
};

const openMindmapSettings = (): void => {
  const { settings } = get();

  set({
    settings: {
      ...settings,
      opened: true,
    },
  });
};

const closeMindmapSettings = (): void => {
  const { settings } = get();

  set({
    settings: {
      ...settings,
      opened: false,
    },
  });
};

const toggleMindmapAutoFit = (): void => {
  const { settings } = get();

  set({
    settings: {
      ...settings,
      autoFit: !settings.autoFit,
    },
  });
};

export {
  connectMindmap,
  updateMindmapNodes,
  updateMindmapEdges,
  addInternalMindmapNode,
  startAddingNode,
  cancelAddingNode,
  openMindmapSettings,
  closeMindmapSettings,
  toggleMindmapAutoFit,
};
