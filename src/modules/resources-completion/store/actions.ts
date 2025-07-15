import { ResourcesCompletionDto, ResourceId } from "api-4markdown-contracts";
import { setLastCompletionMdate, useResourcesCompletionState } from ".";

const { set, get } = useResourcesCompletionState;

const toggleResourceCompletionAction = (resourceId: ResourceId): void => {
  const { completion } = get();

  set({
    completion: {
      ...completion,
      [resourceId]: !completion[resourceId],
    },
  });
};

const updateResourceCompletionAction = (
  completion: ResourcesCompletionDto,
): void => {
  set({
    completion: {
      ...get().completion,
      ...completion,
    },
  });
  setLastCompletionMdate(completion.mdate);
};

export { toggleResourceCompletionAction, updateResourceCompletionAction };
