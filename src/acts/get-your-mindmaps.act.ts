import { getAPI, getCache, parseError, setCache } from 'api-4markdown';

import type { API4MarkdownContractKey } from 'api-4markdown-contracts';
import { useYourMindmapsState } from 'store/your-mindmaps';

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
      return;
    }

    useYourMindmapsState.swap({ is: `busy` });

    const yourMindmaps = await getAPI().call(key)();

    setCache(key, yourMindmaps);

    useYourMindmapsState.swap({
      is: `ok`,
      ...yourMindmaps,
    });
  } catch (error: unknown) {
    useYourMindmapsState.swap({ is: `fail`, error: parseError(error) });
  }
};

export { getYourMindmapsAct };
