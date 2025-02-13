import type { MindmapNode } from 'api-4markdown-contracts';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import { updateMindmapShapeAct } from './update-mindmap-shape.act';
import { parseError } from 'api-4markdown';

const removeMindmapNodesAct = async (): Promise<
  ReturnType<typeof updateMindmapShapeAct>
> => {
  try {
    const { activeMindmap } = mindmapCreatorReadySelector(
      useMindmapCreatorState.get(),
    );

    const newNodes = activeMindmap.nodes.filter((node) => !node.selected);
    const newNodesIds = newNodes.reduce<Record<MindmapNode['id'], boolean>>(
      (acc, node) => {
        acc[node.id] = true;
        return acc;
      },
      {},
    );

    useMindmapCreatorState.set({
      activeMindmap: {
        ...activeMindmap,
        nodes: newNodes,
        edges: activeMindmap.edges.filter(
          ({ source, target }) => newNodesIds[source] && newNodesIds[target],
        ),
      },
      savingDisabled: false,
    });

    return updateMindmapShapeAct();
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { removeMindmapNodesAct };
