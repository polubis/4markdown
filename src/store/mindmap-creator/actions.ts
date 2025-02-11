import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import { useMindmapCreatorState } from '.';
import { mindmapReadySelector } from './selectors';
import type {
  EmbeddedNode,
  MindmapDto,
  MindmapNode,
  MindmapNodeType,
} from 'api-4markdown-contracts';
import type { MindmapCreatorActiveState } from './models';
import { generateIdFromSessionStamp } from 'core/session-stamps';

const { set, get, swap } = useMindmapCreatorState;

const getOkState = (): MindmapCreatorActiveState => mindmapReadySelector(get());

const updateNodesAction = (changes: NodeChange[]): void => {
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      nodes: applyNodeChanges(
        changes,
        activeMindmap.nodes,
      ) as MindmapDto['nodes'],
    },
    savingDisabled: false,
  });
};

const updateEdgesAction = (changes: EdgeChange[]): void => {
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      edges: applyEdgeChanges(
        changes,
        activeMindmap.edges,
      ) as MindmapDto['edges'],
    },
    savingDisabled: false,
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
          id: generateIdFromSessionStamp(),
          type: `visited`,
          source,
          target,
        },
      ],
    },
    savingDisabled: false,
  });
};

const removeNodesConnectionAction = (id: MindmapNode['id']): void => {
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      edges: activeMindmap.edges.filter((edge) => edge.id !== id),
    },
    savingDisabled: false,
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

  set({
    activeMindmapNode,
    activeMindmap: {
      ...activeMindmap,
      nodes: activeMindmap.nodes.map((node) => ({
        ...node,
        selected: false,
      })),
    },
  });
};

const initializeMindmapAction = (mindmap: MindmapDto): void => {
  swap({
    is: `active`,
    activeMindmap: mindmap,
    activeMindmapNode: null,
    savingDisabled: true,
  });
};

const setMindmapAction = (activeMindmap: MindmapDto): void => {
  set({ activeMindmap });
};

const addNewNodeAction = <TType extends MindmapNodeType>(
  type: TType,
  data: Extract<MindmapNode, { type: TType }>['data'],
): void => {
  const { activeMindmap } = getOkState();
  const id = generateIdFromSessionStamp();

  if (type === `embedded`) {
    set({
      activeMindmap: {
        ...activeMindmap,
        nodes: [
          ...activeMindmap.nodes.map((node) => ({ ...node, selected: false })),
          {
            id,
            position: {
              x: 0,
              y: 0,
            },
            selected: true,
            data,
            type,
          } as EmbeddedNode,
        ],
      },
      savingDisabled: false,
    });
  }
};

const removeSelectedNodesAction = (): void => {
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      nodes: activeMindmap.nodes.filter((node) => !node.selected),
    },
  });
};

export {
  updateNodesAction,
  updateEdgesAction,
  connectNodesAction,
  removeNodesConnectionAction,
  toggleMindmapNodeAction,
  setMindmapAction,
  addNewNodeAction,
  initializeMindmapAction,
  removeSelectedNodesAction,
};
