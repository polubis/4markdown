import type { MindmapNode } from 'api-4markdown-contracts';
import { mock } from 'development-kit/mock';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapReadySelector } from 'store/mindmap-creator/selectors';

const getNestedMindmapAct = async (
  nodeId: MindmapNode['id'],
): Promise<void> => {
  const { activeMindmap } = mindmapReadySelector(useMindmapCreatorState.get());

  try {
    useMindmapCreatorState.set({
      activeMindmap: {
        ...activeMindmap,
        nodes: activeMindmap.nodes.map((node) =>
          node.id === nodeId
            ? ({
                ...node,
                data: {
                  ...node.data,
                  loading: true,
                },
              } as MindmapNode)
            : node,
        ),
      },
    });

    await mock({ delay: 1 })({})({});

    useMindmapCreatorState.set({
      activeMindmap: {
        ...activeMindmap,
        nodes: activeMindmap.nodes.map((node) =>
          node.id === nodeId
            ? ({
                ...node,
                data: {
                  ...node.data,
                  loading: false,
                },
              } as MindmapNode)
            : node,
        ),
      },
    });
  } catch {}
};

export { getNestedMindmapAct };
