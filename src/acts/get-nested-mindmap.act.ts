import type { Mindmap, MindmapNode } from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { otherMindmap } from 'store/mindmap-creator/config';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';

const getNestedMindmapAct = async (
  nodeId: MindmapNode['id'],
): Promise<void> => {
  const { activeMindmap } = mindmapReadySelector(useMindmapCreatorState.get());

  const foundNode = activeMindmap.nodes.find((node) => node.id === nodeId);

  if (!foundNode) {
    return;
  }

  try {
    useMindmapCreatorState.set({
      activeMindmap: {
        ...activeMindmap,
        nodes: activeMindmap.nodes.map((node) =>
          node.id === nodeId
            ? {
                ...foundNode,
                type: `pending`,
              }
            : node,
        ),
      },
    });

    await mock({ delay: 1 })({})({});

    useMindmapCreatorState.set({
      activeMindmap: {
        ...activeMindmap,
        nodes: [
          ...activeMindmap.nodes.map((node) =>
            node.id === nodeId ? foundNode : node,
          ),
          //   ...otherMindmap.nodes,
        ],
        // edges: [...activeMindmap.edges, ...otherMindmap.edges],
      },
    });
  } catch {}
};

export { getNestedMindmapAct };
