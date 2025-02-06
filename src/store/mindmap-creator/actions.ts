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
import type { MindmapCreatorOkState } from './models';

const generateId = (): string => {
  const sessionId = (window as any).__sessionStamp__;

  if (typeof sessionId !== `number`) throw Error(`Cannot read build id`);

  return `${sessionId}:${performance.now()}`;
};

const { set, get } = useMindmapCreatorState;

const getOkState = (): MindmapCreatorOkState => mindmapReadySelector(get());

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
          id: generateId(),
          type: `visited`,
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

const setMindmapAction = (activeMindmap: MindmapDto): void => {
  set({ activeMindmap });
};

const addNewNodeAction = <TType extends MindmapNodeType>(
  type: TType,
  data: Extract<MindmapNode, { type: TType }>['data'],
): void => {
  const { activeMindmap } = getOkState();
  const id = generateId();

  if (type === `embedded`) {
    set({
      activeMindmap: {
        ...activeMindmap,
        nodes: [
          ...activeMindmap.nodes,
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
    });
  }
};

export {
  updateNodesAction,
  updateEdgesAction,
  connectNodesAction,
  removeNodesConnectionAction,
  toggleMindmapNodeAction,
  setMindmapAction,
  addNewNodeAction,
};
