import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import { useResourcesCompletionState } from "../store";
import { API4MarkdownContractKey, Atoms } from "api-4markdown-contracts";
import { mock } from "development-kit/mock";

const loadResourceCompletionsAct = async (): Promise<void> => {
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

    // Mock implementation using development-kit/mock utility
    const mockCompletions: Record<Atoms["ResourceId"], never> = {};
    const mockCall = mock({ delay: 0.5 })(mockCompletions);
    const completions = await mockCall(undefined as never);

    // Original API call implementation (commented out)
    // const completions = await getAPI().call(key)();

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

export { loadResourceCompletionsAct };
