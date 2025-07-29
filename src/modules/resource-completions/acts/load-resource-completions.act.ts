import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import { useResourcesCompletionState } from "../store";
import { API4MarkdownContractKey } from "api-4markdown-contracts";

const loadCompletionAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getUserResourceCompletions`;

    const cachedCompletions = getCache(key);

    if (cachedCompletions !== null) {
      useResourcesCompletionState.swap({
        is: `ok`,
        data: cachedCompletions,
      });
      return;
    }

    useResourcesCompletionState.swap({ is: `busy` });

    const completions = await getAPI().call(key)();

    useResourcesCompletionState.swap({
      is: `ok`,
      data: completions,
    });

    setCache(key, completions);
  } catch (error) {
    useResourcesCompletionState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { loadCompletionAct };
