import { getAPI, parseError } from 'api-4markdown';
import { useMindmapCreatorState } from 'store/mindmap-creator';

const getYourMindmapsAct = async (): Promise<void> => {
  try {
    const { mindmaps } = useMindmapCreatorState.get();

    if (mindmaps.is === `busy` || mindmaps.is === `ok`) return;

    useMindmapCreatorState.set({
      mindmaps: { is: `busy` },
    });

    const data = await getAPI().call(`getYourMindmaps`)();

    useMindmapCreatorState.set({
      mindmaps: { is: `ok`, data },
    });
  } catch (error: unknown) {
    useMindmapCreatorState.set({
      mindmaps: { is: `fail`, error: parseError(error) },
    });
  }
};

export { getYourMindmapsAct };
