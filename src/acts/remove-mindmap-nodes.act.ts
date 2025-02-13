import type { MindmapNode } from 'api-4markdown-contracts';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import { getAPI, parseError, setCache } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import { yourMindmapsReadySelector } from 'store/your-mindmaps/selectors';
import { useYourMindmapsState } from 'store/your-mindmaps';

const removeMindmapNodesAct = async (): AsyncResult => {
  try {
    useMindmapCreatorState.set({ saving: true });

    const { activeMindmap } = mindmapCreatorReadySelector(
      useMindmapCreatorState.get(),
    );
    const yourMindmaps = yourMindmapsReadySelector(useYourMindmapsState.get());

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
      saving: false,
    });

    const updatedYourMindmaps = yourMindmaps.mindmaps.map((mindmap) =>
      mindmap.id === updatedMindmap.id ? updatedMindmap : mindmap,
    );

    useMindmapCreatorState.set({
      activeMindmap: updatedMindmap,
      savingDisabled: true,
      saving: false,
    });

    useYourMindmapsState.set({
      mindmaps: updatedYourMindmaps,
    });

    setCache(`getYourMindmaps`, {
      ...yourMindmaps,
      mindmaps: updatedYourMindmaps,
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
