import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type Connection,
  type NodeChange,
  type Node,
} from '@xyflow/react';
import {
  type MindmapsCreatorStoreState,
  useMindmapsCreatorStore,
} from './mindmaps-creator.store';
import type { MindmapInternalNode, MindmapNode } from 'api-4markdown-contracts';

const { getState: get, setState: set } = useMindmapsCreatorStore;

const connectMindmap = (connection: Connection): void => {
  const { mindmap } = get();

  set({
    mindmap: {
      ...mindmap,
      edges: addEdge(connection, mindmap.edges),
    },
  });
};

const updateMindmapNodes = (changes: NodeChange[]): void => {
  const { mindmap } = get();

  set({
    mindmap: {
      ...mindmap,
      nodes: applyNodeChanges(
        changes,
        mindmap.nodes as Node[],
      ) as MindmapNode[],
    },
  });
};

const updateMindmapEdges = (changes: EdgeChange[]): void => {
  const { mindmap } = get();

  set({
    mindmap: {
      ...mindmap,
      edges: applyEdgeChanges(changes, mindmap.edges),
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

const changeMindmapSettings = (
  setter:
    | ((
        settings: MindmapsCreatorStoreState['settings'],
      ) => Partial<MindmapsCreatorStoreState['settings']>)
    | Partial<MindmapsCreatorStoreState['settings']>,
): void => {
  const { settings } = get();

  set({
    settings: {
      ...settings,
      ...(typeof setter === `function` ? setter(settings) : setter),
    },
  });
};

const openMindmapSettings = (): void => {
  changeMindmapSettings({ opened: true });
};

const closeMindmapSettings = (): void => {
  changeMindmapSettings({ opened: false });
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
  changeMindmapSettings,
};
