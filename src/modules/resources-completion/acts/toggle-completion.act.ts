import { API4MarkdownContractKey, ResourceId } from "api-4markdown-contracts";
import {
  toggleCompletionAction,
  updateResourceCompletionAction,
} from "../store/actions";
import { getAPI, setCache } from "api-4markdown";
import { useResourcesCompletionState } from "../store";
import { okResourcesCompletionSelector } from "../store/selectors";

const toggleCompletionAct = async (resourceId: ResourceId): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `updateResourceCompletion`;

    toggleCompletionAction(resourceId);

    const state = okResourcesCompletionSelector(
      useResourcesCompletionState.get(),
    );

    const dto = await getAPI().call(key)({
      resourceId,
      isCompleted: state.completion[resourceId],
    });

    updateResourceCompletionAction(dto);
    setCache(key, dto);
  } catch (error) {}
};

export { toggleCompletionAct };
