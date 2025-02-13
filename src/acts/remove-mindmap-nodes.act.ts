import type { MindmapNode } from 'api-4markdown-contracts';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import { getAPI, parseError } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';

const removeMindmapNodesAct = async (): AsyncResult => {
  try {
    useMindmapCreatorState.set({ saving: true });

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

    const updatedMindmap = await getAPI().call(`updateMindmapShape`)({
      id: activeMindmap.id,
      mdate: activeMindmap.mdate,
      nodes: newNodes,
      edges: activeMindmap.edges.filter(
        ({ source, target }) => newNodesIds[source] && newNodesIds[target],
      ),
      orientation: activeMindmap.orientation,
    });

    useMindmapCreatorState.set({
      activeMindmap: updatedMindmap,
      savingDisabled: false,
      saving: true,
    });
    return { is: `ok` };
  } catch (error: unknown) {
    useMindmapCreatorState.set({
      saving: false,
    });
    return { is: `fail`, error: parseError(error) };
  }
};

export { removeMindmapNodesAct };
