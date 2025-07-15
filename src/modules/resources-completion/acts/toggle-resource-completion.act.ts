import { ResourceId } from "api-4markdown-contracts";
import {
  toggleResourceCompletionAction,
  updateResourceCompletionAction,
} from "../store/actions";
import { getAPI } from "api-4markdown";
import { getLastCompletionMdate, useResourcesCompletionState } from "../store";

const toggleResourceCompletionAct = async (
  resourceId: ResourceId,
): Promise<void> => {
  toggleResourceCompletionAction(resourceId);

  const { completion: currentCompletion } = useResourcesCompletionState.get();

  try {
    const mdate = getLastCompletionMdate();

    if (!mdate) {
      throw Error(`Invalid update attempt. Cannot find last completion mdate`);
    }

    const completion = await getAPI().call("updateResourceCompletion")({
      resourceId,
      isCompleted: currentCompletion[resourceId],
      mdate,
    });

    updateResourceCompletionAction(completion);
  } catch (error) {}
};

export { toggleResourceCompletionAct };
