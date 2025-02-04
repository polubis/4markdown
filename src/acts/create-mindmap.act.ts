import { getAPI, parseError } from 'api-4markdown';
import type {
  API4MarkdownPayload,
  PrivateMindmapDto,
} from 'api-4markdown-contracts';
import { type AsyncResult } from 'development-kit/utility-types';
import { useMindmapCreatorState } from 'store/mindmap-creator';

const createMindmapAct = async (
  payload: API4MarkdownPayload<`createMindmap`>,
): AsyncResult<PrivateMindmapDto> => {
  try {
    const data = await getAPI().call(`createMindmap`)(payload);

    useMindmapCreatorState.swap({
      is: `ok`,
      activeMindmap: data,
      initialMindmap: data,
      browsedMindmaps: [],
      activeMindmapNode: null,
    });

    return { is: `ok`, data };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { createMindmapAct };
