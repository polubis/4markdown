import Dagre from '@dagrejs/dagre';
import { type MindmapCreatorStoreOkState } from './mindmap-creator.store';

const getLayoutedElements = ({
  nodes,
  edges,
  orientation,
}: MindmapCreatorStoreOkState['mindmap']): Pick<
  MindmapCreatorStoreOkState['mindmap'],
  'nodes' | 'edges'
> => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: orientation === `x` ? `LR` : `TB`,
    ranksep: 100,
    nodesep: 50,
  });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);

      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

export { getLayoutedElements };
