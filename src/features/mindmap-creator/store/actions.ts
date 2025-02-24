import { type SUID, suid } from 'development-kit/suid';
import { useMindmapCreatorStore } from '.';
import type {
  MindmapCreatorEdge,
  MindmapCreatorEmbeddedNode,
  MindmapCreatorExternalNode,
  MindmapCreatorNode,
  MindmapCreatorStore,
} from './models';
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import Dagre from '@dagrejs/dagre';

const { get, set } = useMindmapCreatorStore;

const rotateView = ({
  nodes,
  edges,
  orientation,
}: Pick<MindmapCreatorStore, 'edges' | 'nodes' | 'orientation'>) => {
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

const addNewEmbeddedNodeAction = (
  data: MindmapCreatorEmbeddedNode['data'],
): void => {
  const { nodes } = get();

  set({
    nodes: [
      ...nodes,
      ...nodes.map((node) => ({
        ...node,
        selected: false,
      })),
      {
        id: suid(),
        position: {
          x: 0,
          y: 0,
        },
        selected: true,
        data,
        type: `embedded`,
      },
    ],
    nodeForm: { is: `closed` },
  });
};

const addNewExternalNodeAction = (
  data: MindmapCreatorExternalNode['data'],
): void => {
  const { nodes } = get();

  set({
    nodes: [
      ...nodes.map((node) => ({
        ...node,
        selected: false,
      })),
      {
        id: suid(),
        position: {
          x: 0,
          y: 0,
        },
        selected: true,
        data,
        type: `external`,
      },
    ],
    nodeForm: { is: `closed` },
  });
};

const closeNodeFormAction = (): void => {
  set({
    nodeForm: { is: `closed` },
  });
};

const openNodeFormAction = (): void => {
  set({
    nodeForm: { is: `active` },
  });
};

const updateNodesAction = (changes: NodeChange[]): void => {
  const { nodes } = get();

  set({
    nodes: applyNodeChanges(changes, nodes) as MindmapCreatorNode[],
  });
};

const updateEdgesAction = (changes: EdgeChange[]): void => {
  const { edges } = get();

  set({
    edges: applyEdgeChanges(changes, edges) as MindmapCreatorEdge[],
  });
};

const connectNodesAction = ({ source, target }: Connection): void => {
  const { edges } = get();

  set({
    edges: [
      ...edges,
      {
        id: suid(),
        type: `solid`,
        source: source as SUID,
        target: target as SUID,
      },
    ],
  });
};

const removeEdgeAction = (id: MindmapCreatorEdge['id']): void => {
  const { edges } = get();

  set({
    edges: edges.filter((edge) => edge.id !== id),
  });
};

const rotateViewAction = (): void => {
  const { orientation, nodes, edges } = get();

  const newOrientation = orientation === `x` ? `y` : `x`;
  const rotatedStructure = rotateView({
    nodes,
    edges,
    orientation: newOrientation,
  });

  set({
    ...rotatedStructure,
    orientation: newOrientation,
  });
};

export {
  addNewEmbeddedNodeAction,
  addNewExternalNodeAction,
  closeNodeFormAction,
  openNodeFormAction,
  updateNodesAction,
  updateEdgesAction,
  connectNodesAction,
  removeEdgeAction,
  rotateViewAction,
};
