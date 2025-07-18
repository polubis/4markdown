import { useCopy } from "development-kit/use-copy";
import React from "react";
import { toggleCompletionAct } from "../acts/toggle-completion.act";
import { ResourceId, ResourceCompletionType } from "api-4markdown-contracts";
import { useResourceCompletionCheck } from "./use-resource-completion-check";

const useResourcesCompletion = (
  resourceId: ResourceId,
  type: ResourceCompletionType,
) => {
  const isCompleted = useResourceCompletionCheck(resourceId);
  const [message, showMessage] = useCopy();

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
