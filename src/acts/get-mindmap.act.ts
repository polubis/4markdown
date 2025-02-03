import { parseError } from 'api-4markdown';
import { mock } from 'development-kit/mock';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { defaultMindmap } from 'store/mindmap-creator/config';

const loadMindmap = async (): Promise<void> => {
  useMindmapCreatorState.swap({ is: `busy` });

  await mock({ delay: 1 })({})({});

  useMindmapCreatorState.swap({
    is: `ok`,
    activeMindmap: defaultMindmap,
    initialMindmap: defaultMindmap,
    browsedMindmaps: [],
    activeMindmapNode: null,
  });
};

const getMindmapAct = async (): Promise<void> => {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get(`id`);
    const mindmapCreatorState = useMindmapCreatorState.get();

    if (!id) {
      useMindmapCreatorState.swap({
        is: `fail`,
        error: {
          message: `There is no mindmap id in the URL`,
          content: `There is no mindmap id in the URL`,
          symbol: `not-found`,
        },
      });
      return;
    }

    if (
      mindmapCreatorState.is === `ok` &&
      id === mindmapCreatorState.activeMindmap.id
    ) {
      return;
    }

    loadMindmap();
  } catch (error: unknown) {
    useMindmapCreatorState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { getMindmapAct };
