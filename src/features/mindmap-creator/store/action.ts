import { type SUID, suid } from 'development-kit/suid';
import { useMindmapCreatorStore } from '.';
import type {
  MindmapCreatorEdge,
  MindmapCreatorEmbeddedNode,
  MindmapCreatorExternalNode,
  MindmapCreatorNode,
} from './models';
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from '@xyflow/react';

const { get, set } = useMindmapCreatorStore;

const addNewEmbeddedNodeAction = (
  data: MindmapCreatorEmbeddedNode['data'],
): void => {
  const { nodes } = get();

  set({
    nodes: [
      ...nodes,
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

export {
  addNewEmbeddedNodeAction,
  addNewExternalNodeAction,
  closeNodeFormAction,
  openNodeFormAction,
  updateNodesAction,
  updateEdgesAction,
  connectNodesAction,
};
