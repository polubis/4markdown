import React from "react";
import { Button } from "design-system/button";
import { BiCheck, BiX } from "react-icons/bi";
import { useResourcesCompletionState } from "../store";
import { ResourceId } from "api-4markdown-contracts";
import { toggleResourceCompletionAct } from "../acts/toggle-resource-completion.act";
import { useCopy } from "development-kit/use-copy";
import { Status } from "design-system/status";

type ResourcesCompletionTriggerContainerProps = {
  resourceId: ResourceId;
};

const ResourcesCompletionTriggerContainer = ({
  resourceId,
}: ResourcesCompletionTriggerContainerProps) => {
  const { completion } = useResourcesCompletionState();
  // @TODO[PRIO=2]: [Add separate hook for show/hide with delay].
  const [completionMessage, showCompletionMessage] = useCopy();

  const isCompleted = React.useMemo(
    () => Boolean(completion[resourceId]),
    [completion, resourceId],
  );

  const handleToggleCompletion = (): void => {
    toggleResourceCompletionAct(resourceId);
    showCompletionMessage(
      isCompleted
        ? `Resource removed from completed`
        : `Resource added to completed`,
    );
  };

  return (
    <>
      {completionMessage.is === "copied" && (
        <Status>{completionMessage.value}</Status>
      )}
      <Button s={2} i={2} auto onClick={handleToggleCompletion}>
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
    </>
  );
};

export { ResourcesCompletionTriggerContainer };
