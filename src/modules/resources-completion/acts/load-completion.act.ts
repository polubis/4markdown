import { getAPI, parseError } from "api-4markdown";
import { useResourcesCompletionState } from "../store";

const loadCompletionAct = async (): Promise<void> => {
  try {
    const state = useResourcesCompletionState.get();

    if (state.is !== "idle") {
      return;
    }

    useResourcesCompletionState.swap({
      is: `busy`,
    });

    const dto = await getAPI().call("getResourcesCompletion")();

    useResourcesCompletionState.swap({
      is: `ok`,
      completion: dto.completion,
      mdate: dto.mdate,
    });
  } catch (error) {
    useResourcesCompletionState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { loadCompletionAct };
