import { getAPI, parseError, setCache } from 'api-4markdown';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import {
  readyMindmapsSelector,
  safeActiveMindmapSelector,
} from 'store/mindmap-creator/selectors';

// @TODO[PRIO=3]: [Add error parsing at the contracts library level].
const deleteMindmapAct = async (): Promise<void> => {
  try {
    useMindmapCreatorState.set({ operation: { is: `busy` } });

    const mindmapCreatorState = useMindmapCreatorState.get();

    const activeMindmap = safeActiveMindmapSelector(mindmapCreatorState);
    const yourMindmaps = readyMindmapsSelector(mindmapCreatorState.mindmaps);

    await getAPI().call(`deleteMindmap`)({
      id: activeMindmap.id,
    });

    const newMindmaps = yourMindmaps.data.filter(
      (mindmap) => mindmap.id !== activeMindmap.id,
    );

    useMindmapCreatorState.set({
      changesCount: 0,
      mindmaps: {
        is: `ok`,
        data: newMindmaps,
      },
      activeMindmapId: null,
      mindmapDetails: { is: `off` },
      operation: { is: `ok` },
    });

    setCache(`getYourMindmaps`, {
      mindmaps: newMindmaps,
      mindmapsCount: newMindmaps.length,
    });
  } catch (error: unknown) {
    useMindmapCreatorState.set({
      operation: { is: `fail`, error: parseError(error) },
    });
  }
};

export { deleteMindmapAct };
