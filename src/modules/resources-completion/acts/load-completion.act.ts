import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import { useResourcesCompletionState } from "../store";
import { API4MarkdownContractKey } from "api-4markdown-contracts";
import { mock } from "development-kit/mock";

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

    // const dto = await getAPI().call(key)();

    const dto = await mock({ delay: 1 })({
      mdate: new Date().toISOString(),
      completion: {},
    })(null);

    console.log(dto);

    useResourcesCompletionState.swap({
      is: `ok`,
      completion: dto.completion,
      mdate: dto.mdate,
    });

    setCache(key, dto);
  } catch (error) {
    console.log(error);
    useResourcesCompletionState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { loadCompletionAct };
