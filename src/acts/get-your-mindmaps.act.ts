import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { useMindmapCreatorState } from "store/mindmap-creator";

const getYourMindmapsAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourMindmaps`;

    const { mindmaps } = useMindmapCreatorState.get();

    if (mindmaps.is !== `idle`) return;

    const cachedMindmaps = getCache(key);

    if (cachedMindmaps !== null) {
      useMindmapCreatorState.set({
        mindmaps: { is: `ok`, data: cachedMindmaps.mindmaps },
      });
      return;
    }

    useMindmapCreatorState.set({
      mindmaps: { is: `busy` },
    });

    const response = await getAPI().call(key)();

    setCache(key, response);

    useMindmapCreatorState.set({
      mindmaps: { is: `ok`, data: response.mindmaps },
    });
  } catch (error: unknown) {
    useMindmapCreatorState.set({
      mindmaps: { is: `fail`, error: parseError(error) },
    });
  }
};

export { getYourMindmapsAct };
