import { ResourceCompletionDto, ResourceId } from "api-4markdown-contracts";
import { useResourcesCompletionState } from ".";
import { okResourcesCompletionSelector } from "./selectors";

const { set, get } = useResourcesCompletionState;

const toggleResourceCompletionAction = (resourceId: ResourceId): void => {
  const state = okResourcesCompletionSelector(get());

  set({
    ...state,
    completion: {
      ...state.completion,
      [resourceId]: !state.completion[resourceId],
    },
  });
};

const updateResourceCompletionAction = (
  completion: ResourceCompletionDto,
): void => {
  const state = okResourcesCompletionSelector(get());

  set({
    ...state,
    completion: {
      ...state.completion,
      ...completion,
    },
  });
};

export { toggleResourceCompletionAction, updateResourceCompletionAction };
