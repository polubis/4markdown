import React from "react";
import { Button } from "design-system/button";
import { BiCheck, BiX } from "react-icons/bi";
import { useResourcesCompletionState } from "../store";
import { ResourceId } from "api-4markdown-contracts";
import { toggleResourceCompletionAct } from "../acts/toggle-resource-completion.act";

type ResourcesCompletionTriggerContainerProps = {
  resourceId: ResourceId;
};

const ResourcesCompletionTriggerContainer = ({
  resourceId,
}: ResourcesCompletionTriggerContainerProps) => {
  const { completion } = useResourcesCompletionState();

  const isCompleted = React.useMemo(
    () => Boolean(completion[resourceId]),
    [completion, resourceId],
  );

  return (
    <Button
      s={2}
      i={2}
      auto
      onClick={() => toggleResourceCompletionAct(resourceId)}
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
