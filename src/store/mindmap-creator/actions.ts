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
import Dagre from '@dagrejs/dagre';
const { set, get, swap } = useMindmapCreatorState;

const getOkState = (): MindmapCreatorActiveState => mindmapReadySelector(get());

const makeSkeleton = ({
  nodes,
  edges,
  orientation,
}: Pick<MindmapDto, 'nodes' | 'edges' | 'orientation'>) => {
  const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: orientation === `x` ? `LR` : `TB`,
    ranksep: 100,
    nodesep: 50,
  });

  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    graph.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(graph);

  return {
    nodes: nodes.map((node) => {
      const position = graph.node(node.id);

      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

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

  const newNodes = activeMindmap.nodes.filter((node) => !node.selected);
  const newNodesIds = newNodes.reduce<Record<MindmapNode['id'], boolean>>(
    (acc, node) => {
      acc[node.id] = true;
      return acc;
    },
    {},
  );

  set({
    activeMindmap: {
      ...activeMindmap,
      nodes: newNodes,
      edges: activeMindmap.edges.filter(
        ({ source, target }) => newNodesIds[source] && newNodesIds[target],
      ),
    },
    savingDisabled: false,
  });
};

const toggleOrientationAction = (): void => {
  const { activeMindmap } = getOkState();

  const orientation = activeMindmap.orientation === `x` ? `y` : `x`;
  const newActiveMindmap = makeSkeleton({
    nodes: activeMindmap.nodes,
    edges: activeMindmap.edges,
    orientation,
  });

  set({
    activeMindmap: {
      ...activeMindmap,
      ...newActiveMindmap,
      orientation,
    },
    savingDisabled: false,
  });
};

const alignToSkeletonAction = (): void => {
  const { activeMindmap } = getOkState();

  set({
    activeMindmap: {
      ...activeMindmap,
      ...makeSkeleton(activeMindmap),
    },
    savingDisabled: false,
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
  alignToSkeletonAction,
  toggleOrientationAction,
};
