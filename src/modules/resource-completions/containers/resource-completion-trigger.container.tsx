import React from "react";
import { BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";
import { useResourcesCompletionState } from "../store";
import { Button } from "design-system/button";
import { ResourceCompletionDto, ResourceId } from "api-4markdown-contracts";
import { useAuthStore } from "store/auth/auth.store";
import { logIn } from "actions/log-in.action";

type ResourceCompletionTriggerContainerProps = {
  resourceId: ResourceId;
  className?: string;
};

const ResourceCompletionTriggerContainer = ({
  resourceId,
  className,
}: ResourceCompletionTriggerContainerProps) => {
  const { completions } = useResourcesCompletionState();
  const completion = completions[resourceId] as
    | ResourceCompletionDto
    | undefined;

  const triggerToggleCompletion = () => {
    const authStore = useAuthStore.getState();

    if (authStore.is !== "authorized") {
      logIn();
      return;
    }
  };

  return (
    <Button
      className={className}
      s={2}
      i={2}
      auto
      onClick={triggerToggleCompletion}
    >
      {completion ? (
        <>
          Mark As Uncompleted <BiCheckboxMinus />
        </>
      ) : (
        <>
          Mark As Completed <BiCheckboxChecked />
        </>
      )}
    </Button>
  );
};

export { ResourceCompletionTriggerContainer };
