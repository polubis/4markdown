import { getAPI, getCache, parseError, setCache } from 'api-4markdown';

import type {
  API4MarkdownContractKey,
  API4MarkdownDto,
} from 'api-4markdown-contracts';
import { useMindmapCreatorState } from 'store/mindmap-creator';
import { useYourMindmapsState } from 'store/your-mindmaps';

const makeFirstMindmapActive = (
  mindmaps: API4MarkdownDto<`getYourMindmaps`>['mindmaps'],
): void => {
  const [firstMindmap] = mindmaps;

  if (!firstMindmap) return;

  useMindmapCreatorState.swap({
    is: `active`,
    activeMindmap: firstMindmap,
    initialMindmap: firstMindmap,
    browsedMindmaps: [],
    activeMindmapNode: null,
    savingEnabled: false,
  });
};

const getYourMindmapsAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourMindmaps`;

    const { is } = useYourMindmapsState.get();

    if (is !== `idle`) return;

    const cachedMindmaps = getCache(key);

    if (cachedMindmaps !== null) {
      useYourMindmapsState.swap({
        is: `ok`,
        ...cachedMindmaps,
      });
      makeFirstMindmapActive(cachedMindmaps.mindmaps);
      return;
    }

    useYourMindmapsState.swap({ is: `busy` });

    const response = await getAPI().call(key)();

    setCache(key, response);

    useYourMindmapsState.swap({
      is: `ok`,
      ...response,
    });
    makeFirstMindmapActive(response.mindmaps);
  } catch (error: unknown) {
    useYourMindmapsState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { getYourMindmapsAct };
