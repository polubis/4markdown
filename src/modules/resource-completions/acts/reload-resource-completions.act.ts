import { getAPI, parseError, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { useResourcesCompletionState } from "../store";

const reloadResourceCompletionsAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getUserResourceCompletions`;

    useResourcesCompletionState.swap({ is: `busy` });

    const completions = await getAPI().call(key)();

    useResourcesCompletionState.swap({
      is: `ok`,
      data: completions,
    });

    setCache(key, completions);
  } catch (error: unknown) {
    useResourcesCompletionState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { reloadResourceCompletionsAct };
