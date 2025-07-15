import React from "react";
import { Button } from "design-system/button";
import { BiCheck, BiX } from "react-icons/bi";
import { useResourcesCompletionState } from "../store";
import { ResourceId } from "api-4markdown-contracts";
import { toggleResourceCompletionAction } from "../store/actions";
import { okResourcesCompletionSelector } from "../store/selectors";

type ResourcesCompletionTriggerContainerProps = {
  resourceId: ResourceId;
};

const ResourcesCompletionTriggerContainer = ({
  resourceId,
}: ResourcesCompletionTriggerContainerProps) => {
  const resourcesCompletionState = useResourcesCompletionState(
    okResourcesCompletionSelector,
  );

  const isCompleted = React.useMemo(
    () => Boolean(resourcesCompletionState.completion[resourceId]),
    [resourcesCompletionState.completion, resourceId],
  );

  return (
    <Button
      s={2}
      i={2}
      auto
      onClick={() => toggleResourceCompletionAction(resourceId)}
    >
      {isCompleted ? (
        <>
          Mark As Uncompleted <BiX />
        </>
      ) : (
        <>
          Mark As Completed <BiCheck />
        </>
      )}
    </Button>
  );
};

export { ResourcesCompletionTriggerContainer };
