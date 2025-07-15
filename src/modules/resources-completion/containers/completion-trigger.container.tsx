import React from "react";
import { Button } from "design-system/button";
import { BiCheck, BiErrorAlt, BiX } from "react-icons/bi";
import { useResourcesCompletionState } from "../store";
import { ResourceId } from "api-4markdown-contracts";
import { toggleCompletionAct } from "../acts/toggle-completion.act";
import { useCopy } from "development-kit/use-copy";
import { Status } from "design-system/status";
import { OkResourcesCompletionState } from "../store/models";
import { Loader } from "design-system/loader";

type CompletionTriggerContainerProps = {
  resourceId: ResourceId;
};

const CompletionTrigger = ({
  resourceId,
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
    toggleCompletionAct(resourceId);
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
}: CompletionTriggerContainerProps) => {
  const state = useResourcesCompletionState();

  if (state.is === `idle` || state.is === `busy`) {
    return null;
  }

  if (state.is === `fail`) {
    return (
      <p className="flex gap-2 text-sm justify-center mb-4 items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
        <BiErrorAlt className="shrink-0" size={20} />
        Cannot load completion module. {state.error.message}
      </p>
    );
  }

  return (
    <CompletionTrigger resourceId={resourceId} completion={state.completion} />
  );
};

export { CompletionTriggerContainer };
