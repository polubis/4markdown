import { getAPI, parseError, setCache } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  MindmapDto,
} from 'api-4markdown-contracts';
import { type AsyncResult } from 'development-kit/utility-types';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { useYourMindmapsState } from 'store/your-mindmaps';

const createMindmapAct = async (
  payload: API4MarkdownPayload<`createMindmap`>,
): AsyncResult<MindmapDto> => {
  try {
    const data = await getAPI().call(`createMindmap`)(payload);

    useMindmapCreatorState.swap({
      is: `active`,
      activeMindmap: data,
      initialMindmap: data,
      browsedMindmaps: [],
      activeMindmapNode: null,
      savingEnabled: false,
    });

    const yourMindmaps = useYourMindmapsState.get();

    if (yourMindmaps.is === `ok`) {
      const updatedMindmapData: API4MarkdownDto<`getYourMindmaps`> = {
        mindmapsCount: yourMindmaps.mindmaps.length + 1,
        mindmaps: [data, ...yourMindmaps.mindmaps],
      };

      useYourMindmapsState.swap({
        ...yourMindmaps,
        ...updatedMindmapData,
      });

      setCache(`getYourMindmaps`, updatedMindmapData);
    }

    return { is: `ok`, data };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { createMindmapAct };
