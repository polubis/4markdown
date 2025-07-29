import { API4MarkdownPayload } from "api-4markdown-contracts";
import { getAPI, parseError, setCache } from "api-4markdown";
import { AsyncResult } from "development-kit/utility-types";
import { useResourcesCompletionState } from "../store";
import { okResourcesCompletionSelector } from "../store/selectors";

const toggleResourceCompletionAct = async (
  payload: API4MarkdownPayload<"setUserResourceCompletion">,
): AsyncResult => {
  try {
    const completion = await getAPI().call("setUserResourceCompletion")(
      payload,
    );

    const currentCompletions = {
      ...okResourcesCompletionSelector(useResourcesCompletionState.get()).data,
    };

    if (completion) {
      const newCompletions = {
        ...currentCompletions,
        [payload.resourceId]: completion,
      };

      useResourcesCompletionState.swap({
        is: `ok`,
        data: newCompletions,
      });

      setCache("getUserResourceCompletions", newCompletions);

      return { is: `ok` };
    }

    const { [payload.resourceId]: completionToRemove, ...newCompletions } =
      currentCompletions;

    useResourcesCompletionState.swap({
      is: `ok`,
      data: newCompletions,
    });

    setCache("getUserResourceCompletions", newCompletions);

    return { is: `ok` };
  } catch (error) {
    return {
      is: `fail`,
      error: parseError(error),
    };
  }
};

export { toggleResourceCompletionAct };
