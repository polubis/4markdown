import { getAPI, parseError, setCache } from 'api-4markdown';
import type { MindmapDto } from 'api-4markdown-contracts';
import { type AsyncResult } from 'development-kit/utility-types';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { mindmapCreatorReadySelector } from 'store/mindmap-creator/selectors';
import { useYourMindmapsState } from 'store/your-mindmaps';
import { yourMindmapsReadySelector } from 'store/your-mindmaps/selectors';

const updateMindmapNameAct = async (name: MindmapDto['name']): AsyncResult => {
  try {
    useMindmapCreatorState.set({ saving: true });

    const yourMindmaps = yourMindmapsReadySelector(useYourMindmapsState.get());
    const { activeMindmap } = mindmapCreatorReadySelector(
      useMindmapCreatorState.get(),
    );

    const updatedMindmap = await getAPI().call(`updateMindmapName`)({
      id: activeMindmap.id,
      mdate: activeMindmap.mdate,
      name,
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
    useMindmapCreatorState.set({ saving: false });
    return { is: `fail`, error: parseError(error) };
  }
};

export { updateMindmapNameAct };
