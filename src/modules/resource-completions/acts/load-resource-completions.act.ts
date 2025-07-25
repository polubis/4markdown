import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import { useResourcesCompletionState } from "../store";
import { API4MarkdownContractKey } from "api-4markdown-contracts";

const loadCompletionAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getUserResourceCompletions`;

    const cachedCompletions = getCache(key);

    if (cachedCompletions !== null) {
      useResourcesCompletionState.setState({
        idle: false,
        busy: false,
        error: null,
        completions: cachedCompletions,
      });
      return;
    }

    useResourcesCompletionState.setState({
      idle: false,
      busy: true,
      error: null,
      completions: {},
    });

    const completions = await getAPI().call(key)();

    useResourcesCompletionState.setState({
      idle: false,
      busy: false,
      error: null,
      completions,
    });

    setCache(key, completions);
  } catch (error) {
    useResourcesCompletionState.setState({
      idle: false,
      busy: false,
      error: parseError(error),
      completions: {},
    });
  }
};

export { loadCompletionAct };
