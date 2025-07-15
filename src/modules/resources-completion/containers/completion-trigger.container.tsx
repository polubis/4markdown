import React from "react";
import { Button } from "design-system/button";
import { BiCheck, BiX } from "react-icons/bi";
import { useResourcesCompletionState } from "../store";
import { ResourceCompletionType, ResourceId } from "api-4markdown-contracts";
import { toggleCompletionAct } from "../acts/toggle-completion.act";
import { useCopy } from "development-kit/use-copy";
import { Status } from "design-system/status";
import { OkResourcesCompletionState } from "../store/models";

type CompletionTriggerContainerProps = {
  resourceId: ResourceId;
  type: ResourceCompletionType;
};

const TriggerContainer = ({
  resourceId,
  type,
  completion,
}: CompletionTriggerContainerProps & {
  completion: OkResourcesCompletionState["completion"];
}) => {
  // @TODO[PRIO=2]: [Add separate hook for show/hide with delay].
  const [completionMessage, showCompletionMessage] = useCopy();
  const isCompleted = React.useMemo(
    () => Boolean(completion[resourceId]),
    [completion, resourceId],
  );

  const handleToggleCompletion = (): void => {
    toggleCompletionAct(resourceId, type);
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

const CompletionTriggerContainer = ({
  resourceId,
  type,
}: CompletionTriggerContainerProps) => {
  const state = useResourcesCompletionState();

  if (state.is !== "ok") {
    return null;
  }

  return (
    <TriggerContainer
      resourceId={resourceId}
      type={type}
      completion={state.completion}
    />
  );
};

export { CompletionTriggerContainer };
