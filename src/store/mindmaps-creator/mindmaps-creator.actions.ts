import {
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type Connection,
  type NodeChange,
} from '@xyflow/react';
import {
  type MindmapsCreatorStoreState,
  useMindmapsCreatorStore,
} from './mindmaps-creator.store';
import {
  type MindmapEdge,
  type MindmapInternalNode,
  type MindmapNode,
} from 'api-4markdown-contracts';

const { getState: get, setState: set } = useMindmapsCreatorStore;

type MindmapsCreatorStoreOkState = Extract<
  MindmapsCreatorStoreState,
  { is: `ok` }
>;

const isOkState = (
  state: MindmapsCreatorStoreState,
): MindmapsCreatorStoreOkState => {
  if (state.is !== `ok`) throw Error(`State is not ready to work with`);

  return state;
};

const getOkState = (): MindmapsCreatorStoreOkState => isOkState(get());

const connectMindmapNodes = ({ source, target }: Connection): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      edges: [
        ...mindmap.edges,
        {
          id: new Date().toISOString(),
          type: `curved`,
          source,
          target,
        },
      ],
    },
  });
};

const removeMindmapNodesConnection = (id: MindmapEdge['id']): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      edges: mindmap.edges.filter((edge) => edge.id !== id),
    },
  });
};

// @TODO[PRIO=4]: [Make it better typed].
const updateMindmapNodes = (changes: NodeChange[]): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      nodes: applyNodeChanges(changes, mindmap.nodes) as MindmapNode[],
    },
  });
};

const updateMindmapEdges = (changes: EdgeChange[]): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      edges: applyEdgeChanges(changes, mindmap.edges) as MindmapEdge[],
    },
  });
};

const cancelAddingNode = (): void => {
  set({ nodeFormOpened: false });
};

const addInternalMindmapNode = (data: MindmapInternalNode['data']): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      nodes: [
        ...mindmap.nodes,
        {
          // @TODO[PRIO=5]: [Create a function for random ID generation].
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
    nodeFormOpened: false,
  });
};

const startAddingNode = (): void => {
  set({ nodeFormOpened: true });
};

const openMindmapSettings = (): void => {
  set({ settingsOpened: true });
};

const closeMindmapSettings = (): void => {
  set({ settingsOpened: false });
};

const toggleMindmapAutoFit = (): void => {
  const { settings } = getOkState();

  set({
    settings: {
      ...settings,
      autoFit: !settings.autoFit,
    },
  });
};

const toggleMindmapOrientation = (): void => {
  const { mindmap } = getOkState();

  set({
    mindmap: {
      ...mindmap,
      orientation: mindmap.orientation === `x` ? `y` : `x`,
    },
  });
};

export {
  connectMindmapNodes,
  updateMindmapNodes,
  updateMindmapEdges,
  addInternalMindmapNode,
  startAddingNode,
  cancelAddingNode,
  openMindmapSettings,
  closeMindmapSettings,
  toggleMindmapAutoFit,
  removeMindmapNodesConnection,
  toggleMindmapOrientation,
};
