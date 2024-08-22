import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type EdgeChange,
  type Connection,
  type NodeChange,
  type Node,
} from 'reactflow';
import { useMindmapsCreatorStore } from './mindmaps-creator.store';
import type { MindmapNode } from 'api-4markdown-contracts';

const { getState: get, setState: set } = useMindmapsCreatorStore;

const connectMindmap = (connection: Connection): void => {
  set({
    edges: addEdge(connection, get().edges),
  });
};

const updateMindmapNodes = (changes: NodeChange[]): void => {
  set({
    nodes: applyNodeChanges(changes, get().nodes as Node[]) as MindmapNode[],
  });
};

const updateMindmapEdges = (changes: EdgeChange[]): void => {
  set({
    edges: applyEdgeChanges(changes, get().edges),
  });
};

export { connectMindmap, updateMindmapNodes, updateMindmapEdges };
