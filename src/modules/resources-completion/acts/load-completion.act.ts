import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import { useResourcesCompletionState } from "../store";
import { API4MarkdownContractKey } from "api-4markdown-contracts";

const loadCompletionAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getResourcesCompletion`;

    const cachedDto = getCache(key);

    if (cachedDto !== null) {
      useResourcesCompletionState.swap({ is: `ok`, ...cachedDto });
      return;
    }

    useResourcesCompletionState.swap({
      is: `busy`,
    });

    const dto = await getAPI().call(key)();

    useResourcesCompletionState.swap({
      is: `ok`,
      completion: dto.completion,
      mdate: dto.mdate,
    });

    setCache(key, dto);
  } catch (error) {
    useResourcesCompletionState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { loadCompletionAct };
