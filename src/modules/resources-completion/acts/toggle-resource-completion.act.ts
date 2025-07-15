import { ResourceId } from "api-4markdown-contracts";
import {
  toggleResourceCompletionAction,
  updateResourceCompletionAction,
} from "../store/actions";
import { getAPI } from "api-4markdown";
import { useResourcesCompletionState } from "../store";
import { okResourcesCompletionSelector } from "../store/selectors";

const toggleResourceCompletionAct = async (
  resourceId: ResourceId,
): Promise<void> => {
  toggleResourceCompletionAction(resourceId);

  const state = okResourcesCompletionSelector(
    useResourcesCompletionState.get(),
  );

  try {
    const completion = await getAPI().call("updateResourceCompletion")({
      resourceId,
      isCompleted: state.completion[resourceId],
    });

    updateResourceCompletionAction(completion);
  } catch (error) {}
};

export { toggleResourceCompletionAct };
