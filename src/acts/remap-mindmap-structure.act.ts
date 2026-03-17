import type { API4MarkdownPayload } from "api-4markdown-contracts";
import { type SUID, suid } from "development-kit/suid";

type CreateMindmapStructure = Pick<
  API4MarkdownPayload<`createMindmap`>,
  "nodes" | "edges"
>;

const remapMindmapStructure = ({
  nodes,
  edges,
}: CreateMindmapStructure): CreateMindmapStructure => {
  const nodeIdMap = new Map<SUID, SUID>();
  const newNodes = nodes.map((node) => {
    const newId = suid();

    // Keep a stable old->new reference for edge remapping.
    // If duplicated old IDs exist, edges resolve to the first occurrence.
    if (!nodeIdMap.has(node.id)) {
      nodeIdMap.set(node.id, newId);
    }

    return {
      ...node,
      id: newId,
    };
  });

  const newEdges = edges.flatMap((edge) => {
    const source = nodeIdMap.get(edge.source);
    const target = nodeIdMap.get(edge.target);

    // Keep payload consistent when stale edges point to removed nodes.
    if (!source || !target) return [];

    return [
      {
        ...edge,
        id: suid(),
        source,
        target,
      },
    ];
  });

  return { nodes: newNodes, edges: newEdges };
};

export { remapMindmapStructure };
