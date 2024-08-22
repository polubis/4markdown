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

export { connectMindmap, updateMindmapNodes, updateMindmapEdges };
