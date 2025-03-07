import { type SUID, suid } from 'development-kit/suid';
import { useMindmapCreatorState } from '.';
import type {
  MindmapCreatorEdge,
  MindmapCreatorEmbeddedNode,
  MindmapCreatorExternalNode,
  MindmapCreatorNode,
  MindmapCreatorState,
} from './models';
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';
import Dagre from '@dagrejs/dagre';
import { type MindmapDto } from 'api-4markdown-contracts';
import { readyMindmapsSelector } from './selectors';

const { get, set, getInitial } = useMindmapCreatorState;

const rotateView = ({
  nodes,
  edges,
  orientation,
}: Pick<MindmapCreatorState, 'edges' | 'nodes' | 'orientation'>) => {
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
  const { nodes, changesCount } = get();

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
    changesCount: changesCount + 1,
  });
};

const addNewExternalNodeAction = (
  data: MindmapCreatorExternalNode['data'],
): void => {
  const { nodes, changesCount } = get();

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
    changesCount: changesCount + 1,
  });
};

const closeNodeFormAction = (): void => {
  set({
    nodeForm: { is: `closed` },
  });
};

const openNodeFormAction = (
  data?: Pick<MindmapCreatorNode, 'data' | 'type'>,
): void => {
  set({
    nodeForm: data ? { is: `active`, ...data } : { is: `active` },
  });
};

const updateNodesAction = (changes: NodeChange[]): void => {
  const { nodes, changesCount } = get();

  set({
    nodes: applyNodeChanges(changes, nodes) as MindmapCreatorNode[],
    changesCount: changesCount + 1,
  });
};

const updateEdgesAction = (changes: EdgeChange[]): void => {
  const { edges, changesCount } = get();

  set({
    edges: applyEdgeChanges(changes, edges) as MindmapCreatorEdge[],
    changesCount: changesCount + 1,
  });
};

const connectNodesAction = ({ source, target }: Connection): void => {
  const { edges, changesCount } = get();

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
    changesCount: changesCount + 1,
  });
};

const removeEdgeAction = (id: MindmapCreatorEdge['id']): void => {
  const { edges, changesCount } = get();

  set({
    edges: edges.filter((edge) => edge.id !== id),
    changesCount: changesCount + 1,
  });
};

const rotateViewAction = (): void => {
  const { orientation, nodes, edges, changesCount } = get();

  const newOrientation = orientation === `x` ? `y` : `x`;
  const rotatedStructure = rotateView({
    nodes,
    edges,
    orientation: newOrientation,
  });

  set({
    ...rotatedStructure,
    orientation: newOrientation,
    changesCount: changesCount + 1,
  });
};

const startNodesRemovalAction = (): void => {
  set({ nodesRemovalConfirmation: { is: `active` } });
};

const cancelNodesRemovalAction = (): void => {
  set({ nodesRemovalConfirmation: { is: `closed` } });
};

const removeSelectedNodesAction = (): void => {
  const { nodes, edges, changesCount } = get();

  const newNodes = nodes.filter((node) => !node.selected);
  const newNodesIds = newNodes.reduce<
    Record<MindmapCreatorNode['id'], boolean>
  >((acc, node) => {
    acc[node.id] = true;
    return acc;
  }, {});
  const newEdges = edges.filter(
    ({ source, target }) => newNodesIds[source] && newNodesIds[target],
  );

  set({
    nodes: newNodes,
    edges: newEdges,
    nodesRemovalConfirmation: { is: `closed` },
    changesCount: changesCount + 1,
  });
};

const openMindmapFormAction = (): void => {
  set({
    mindmapForm: { is: `active` },
  });
};

const closeMindmapFormAction = (): void => {
  set({
    mindmapForm: { is: `closed` },
  });
};

const openYourMindmapsViewAction = (): void => {
  set({
    yourMindmapsView: { is: `active` },
  });
};

const closeYourMindmapsViewAction = (): void => {
  set({
    yourMindmapsView: { is: `closed` },
  });
};

const selectMindmapAction = (id: MindmapDto['id']): void => {
  const mindmaps = readyMindmapsSelector(get().mindmaps);

  const foundMindmap = mindmaps.data.find((mindmap) => mindmap.id === id);

  if (!foundMindmap) return;

  set({
    activeMindmapId: id,
    yourMindmapsView: { is: `closed` },
    nodes: foundMindmap.nodes,
    edges: foundMindmap.edges,
    orientation: foundMindmap.orientation,
    changesCount: 0,
  });
};

const resetYourMindmapsAction = (): void => {
  set({
    mindmaps: { is: `idle` },
  });
};

const openNodePreviewAction = (
  data: MindmapCreatorEmbeddedNode['data'],
): void => {
  set({
    nodePreview: { is: `active`, data },
  });
};

const closeNodePreviewAction = (): void => {
  set({
    nodePreview: { is: `closed` },
  });
};

const downloadMindmapAction = (): void => {
  const { orientation, nodes, edges } = get();

  const data = {
    orientation,
    nodes,
    edges,
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: `application/json` });
  const a = document.createElement(`a`);
  a.href = URL.createObjectURL(blob);
  a.download = `data.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const clearMindmapAction = (): void => {
  const { changesCount } = get();

  set({
    nodes: [],
    edges: [],
    orientation: `y`,
    changesCount: changesCount + 1,
  });
};

const resetMindmapAction = (): void => {
  const { changesCount } = get();
  const { nodes, edges, orientation } = getInitial();

  set({
    nodes,
    edges,
    orientation,
    changesCount: changesCount + 1,
  });
};

const resetOperationAction = (): void => {
  set({ operation: { is: `idle` } });
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
  downloadMindmapAction,
  rotateViewAction,
  startNodesRemovalAction,
  cancelNodesRemovalAction,
  removeSelectedNodesAction,
  openMindmapFormAction,
  closeMindmapFormAction,
  openYourMindmapsViewAction,
  closeYourMindmapsViewAction,
  selectMindmapAction,
  resetYourMindmapsAction,
  openNodePreviewAction,
  closeNodePreviewAction,
  clearMindmapAction,
  resetMindmapAction,
  resetOperationAction,
};
