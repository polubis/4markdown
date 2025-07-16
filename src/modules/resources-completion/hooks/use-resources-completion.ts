import { useCopy } from "development-kit/use-copy";
import React from "react";
import { toggleCompletionAct } from "../acts/toggle-completion.act";
import { ResourceId, ResourceCompletionType } from "api-4markdown-contracts";
import { useResourcesCompletionState } from "../store";
import { rawResourcesCompletionSelector } from "../store/selectors";

const useResourcesCompletion = (
  resourceId: ResourceId,
  type: ResourceCompletionType,
) => {
  const completion = useResourcesCompletionState(
    rawResourcesCompletionSelector,
  );
  const [message, showMessage] = useCopy();
  const isCompleted = React.useMemo(
    () => Boolean(completion[resourceId]),
    [completion, resourceId],
  );

  const toggle = React.useCallback((): void => {
    toggleCompletionAct(resourceId, type);
    showMessage(
      isCompleted
        ? `Resource removed from completed`
        : `Resource added to completed`,
    );
  }, [showMessage, isCompleted, resourceId, type]);

  return {
    isCompleted,
    message,
    toggle,
  };
};

export { useResourcesCompletion };
