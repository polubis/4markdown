import { ResourcesCompletionDto, ResourceId } from "api-4markdown-contracts";
import { useResourcesCompletionState } from ".";
import { okResourcesCompletionSelector } from "./selectors";

const { get, swap } = useResourcesCompletionState;

const toggleCompletionAction = (resourceId: ResourceId): void => {
  const state = okResourcesCompletionSelector(get());

  swap({
    ...state,
    completion: {
      ...state.completion,
      [resourceId]: !state.completion[resourceId],
    },
  });
};

const updateResourceCompletionAction = (dto: ResourcesCompletionDto): void => {
  const state = okResourcesCompletionSelector(get());

  swap({
    ...state,
    ...dto,
  });
};

export { toggleCompletionAction, updateResourceCompletionAction };
