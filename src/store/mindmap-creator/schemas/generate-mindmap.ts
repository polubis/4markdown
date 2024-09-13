import type {
  MindmapDto,
  MindmapEdge,
  MindmapNode,
} from 'api-4markdown-contracts';

const generateMindmap = (count: number): MindmapDto => {
  const now = new Date().toISOString();

  const nodes = Array.from(
    { length: count },
    (_, i): MindmapNode => ({
      id: `${i}${now}:node`,
      position: {
        x: 0,
        y: 1,
      },
      data: {
        url: `https://google.com`,
        description: `It's node description: ${i}`,
        name: `It's node: ${i}`,
      },
      type: `external`,
    }),
  );

  const edges = Array.from(
    { length: count },
    (_, i): MindmapEdge => ({
      id: `${i}${now}:edge`,
      type: `curved`,
      source: nodes[i].id,
      target: nodes[i + 1]?.id ? nodes[i + 1].id : nodes[0].id,
    }),
  );

  return {
    id: `id:${now}`,
    cdate: now,
    mdate: now,
    nodes,
    edges,
    description: `It's my test mindmap graph`,
    name: `My custom mindmap graph`,
    orientation: `x`,
  };
};

export { generateMindmap };
