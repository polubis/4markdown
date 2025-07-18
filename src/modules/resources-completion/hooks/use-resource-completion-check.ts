import { ResourceId } from "api-4markdown-contracts";
import { useResourcesCompletionState } from "../store";
import { rawResourcesCompletionSelector } from "../store/selectors";

const useResourceCompletionCheck = (resourceId: ResourceId): boolean => {
  const completion = useResourcesCompletionState(
    rawResourcesCompletionSelector,
  );

  return Boolean(completion[resourceId]);
};

export { useResourceCompletionCheck };
