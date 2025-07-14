import { useMindmapCreatorState } from "store/mindmap-creator";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { getAPI, parseError, setCache } from "api-4markdown";

const reloadYourMindmapsAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getYourMindmaps`;

    useMindmapCreatorState.set({
      mindmaps: { is: `idle` },
      activeMindmapId: null,
      operation: { is: `idle` },
    });

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

export { reloadYourMindmapsAct };
