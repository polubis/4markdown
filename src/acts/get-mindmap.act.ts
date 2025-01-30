import { parseError } from 'api-4markdown';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { defaultMindmap } from 'store/mindmap-creator/config';

const getMindmapAct = async (): Promise<void> => {
  try {
    useMindmapCreatorState.swap({ is: `busy` });
    useMindmapCreatorState.swap({
      is: `ok`,
      activeMindmap: defaultMindmap,
      initialMindmap: defaultMindmap,
      browsedMindmaps: [],
      activeMindmapNode: null,
    });
  } catch (error: unknown) {
    useMindmapCreatorState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { getMindmapAct };
