import { getAPI, parseError } from 'api-4markdown';
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
      mdate: activeMindmap.mdate,
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
