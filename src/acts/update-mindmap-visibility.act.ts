import { getAPI, parseError } from 'api-4markdown';
import type { Visibility } from 'api-4markdown-contracts';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  readyMindmapsSelector,
  safeActiveMindmapSelector,
} from 'store/mindmap-creator/selectors';

const updateMindmapVisibilityAct = async (
  visibility: Visibility,
): Promise<void> => {
  try {
    useMindmapCreatorState.set({ operation: { is: `busy` } });

    const mindmapCreatorState = useMindmapCreatorState.get();

    const activeMindmap = safeActiveMindmapSelector(mindmapCreatorState);
    const yourMindmaps = readyMindmapsSelector(mindmapCreatorState.mindmaps);

    const response = await getAPI().call(`updateMindmapVisibility`)({
      mdate: activeMindmap.mdate,
      id: activeMindmap.id,
      visibility,
    });

    useMindmapCreatorState.set({
      mindmaps: {
        is: `ok`,
        data: yourMindmaps.data.map((mindmap) =>
          mindmap.id === activeMindmap.id
            ? {
                ...mindmap,
                mdate: response.mdate,
                visibility,
              }
            : mindmap,
        ),
      },
      operation: { is: `ok` },
    });
  } catch (error: unknown) {
    useMindmapCreatorState.set({
      operation: { is: `fail`, error: parseError(error) },
    });
  }
};

export { updateMindmapVisibilityAct };
