import { getAPI, parseError, setCache } from 'api-4markdown';
import { type AsyncResult } from 'development-kit/utility-types';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import { useYourMindmapsState } from 'store/your-mindmaps';
import { yourMindmapsReadySelector } from 'store/your-mindmaps/selectors';

const updateMindmapShapeAct = async (): AsyncResult => {
  try {
    const yourMindmaps = yourMindmapsReadySelector(useYourMindmapsState.get());

    const { activeMindmap } = mindmapCreatorReadySelector(
      useMindmapCreatorState.get(),
    );

    const updatedMindmap = await getAPI().call(`updateMindmapShape`)({
      id: activeMindmap.id,
      mdate: activeMindmap.mdate,
      nodes: activeMindmap.nodes,
      edges: activeMindmap.edges,
      orientation: activeMindmap.orientation,
    });

    const updatedYourMindmaps = yourMindmaps.mindmaps.map((mindmap) =>
      mindmap.id === updatedMindmap.id ? updatedMindmap : mindmap,
    );

    useMindmapCreatorState.set({
      activeMindmap: updatedMindmap,
      savingDisabled: true,
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
    return { is: `fail`, error: parseError(error) };
  }
};

export { updateMindmapShapeAct };
