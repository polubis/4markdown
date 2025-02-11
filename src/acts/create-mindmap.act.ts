import { getAPI, parseError, setCache } from 'api-4markdown';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  MindmapDto,
} from 'api-4markdown-contracts';
import { type AsyncResult } from 'development-kit/utility-types';
import { initializeMindmapAction } from 'store/mindmap-creator/actions';
import { useYourMindmapsState } from 'store/your-mindmaps';

const createMindmapAct = async (
  payload: API4MarkdownPayload<`createMindmap`>,
): AsyncResult<MindmapDto> => {
  try {
    const data = await getAPI().call(`createMindmap`)(payload);

    initializeMindmapAction(data);

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
