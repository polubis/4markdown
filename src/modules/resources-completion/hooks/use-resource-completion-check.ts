import React from "react";
import { ResourceId } from "api-4markdown-contracts";
import { useResourcesCompletionState } from "../store";
import { rawResourcesCompletionSelector } from "../store/selectors";

const useResourceCompletionCheck = (resourceId: ResourceId): boolean => {
  const completion = useResourcesCompletionState(
    rawResourcesCompletionSelector,
  );

  return React.useMemo(
    () => Boolean(completion[resourceId]),
    [completion, resourceId],
  );
};

export { useResourceCompletionCheck };
