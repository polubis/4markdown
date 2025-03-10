import { getAPI, parseError } from 'api-4markdown';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  readyMindmapsSelector,
  safeActiveMindmapSelector,
} from 'store/mindmap-creator/selectors';

const deleteMindmapAct = async (): Promise<void> => {
  try {
    useMindmapCreatorState.set({ operation: { is: `busy` } });

    const mindmapCreatorState = useMindmapCreatorState.get();

    const activeMindmap = safeActiveMindmapSelector(mindmapCreatorState);
    const yourMindmaps = readyMindmapsSelector(mindmapCreatorState.mindmaps);

    await getAPI().call(`deleteMindmap`)({
      mdate: activeMindmap.mdate,
      id: activeMindmap.id,
    });

    useMindmapCreatorState.set({
      changesCount: 0,
      mindmaps: {
        is: `ok`,
        data: yourMindmaps.data.filter(
          (mindmap) => mindmap.id !== activeMindmap.id,
        ),
      },
      activeMindmapId: null,
      mindmapDetails: { is: `off` },
      operation: { is: `ok` },
    });
  } catch (error: unknown) {
    useMindmapCreatorState.set({
      operation: { is: `fail`, error: parseError(error) },
    });
  }
};

export { deleteMindmapAct };
