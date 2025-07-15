import { ResourceId } from "api-4markdown-contracts";
import {
  toggleCompletionAction,
  updateResourceCompletionAction,
} from "../store/actions";
import { getAPI } from "api-4markdown";
import { useResourcesCompletionState } from "../store";
import { okResourcesCompletionSelector } from "../store/selectors";

const toggleCompletionAct = async (resourceId: ResourceId): Promise<void> => {
  toggleCompletionAction(resourceId);

  const state = okResourcesCompletionSelector(
    useResourcesCompletionState.get(),
  );

  try {
    const dto = await getAPI().call("updateResourceCompletion")({
      resourceId,
      isCompleted: state.completion[resourceId],
    });

    updateResourceCompletionAction(dto);
  } catch (error) {}
};

export { toggleCompletionAct };
