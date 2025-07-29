import React from "react";
import { BiCheckboxChecked, BiCheckboxMinus, BiError } from "react-icons/bi";
import { useResourcesCompletionState } from "../store";
import { Button } from "design-system/button";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { useAuthStore } from "store/auth/auth.store";
import { logIn } from "actions/log-in.action";
import { toggleResourceCompletionAct } from "../acts/toggle-resource-completion.act";
import { Transaction } from "development-kit/utility-types";
import { loadCompletionAct } from "../acts/load-resource-completions.act";

type ResourceCompletionTriggerContainerProps = {
  className?: string;
} & API4MarkdownPayload<"setUserResourceCompletion">;

const TriggerContainer = ({
  className,
  ...payload
}: ResourceCompletionTriggerContainerProps) => {
  const completions = useResourcesCompletionState();
  const [completionChange, setCompletionChange] = React.useState<Transaction>({
    is: `idle`,
  });

  const triggerToggleCompletion = async () => {
    setCompletionChange({ is: `busy` });
    setCompletionChange(await toggleResourceCompletionAct(payload));
  };

  if (completions.is === "idle" || completions.is === "busy") {
    return (
      <Button className={className} disabled s={2} i={2} auto>
        Loading...
      </Button>
    );
  }

  if (completions.is === "fail") {
    return (
      <Button
        className={className}
        s={2}
        i={2}
        auto
        onClick={() => loadCompletionAct(true)}
      >
        <BiError /> Ups, Try Again
      </Button>
    );
  }

  return (
    <Button
      className={className}
      s={2}
      i={2}
      disabled={completionChange.is === "busy"}
      auto
      onClick={triggerToggleCompletion}
    >
      {completions.data[payload.resourceId] ? (
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

const ResourceCompletionTriggerContainer = ({
  className,
  ...payload
}: ResourceCompletionTriggerContainerProps) => {
  const authStore = useAuthStore();

  if (authStore.is === "authorized") {
    return <TriggerContainer {...payload} className={className} />;
  }

  return (
    <Button
      disabled={authStore.is === "idle"}
      className={className}
      s={2}
      i={2}
      auto
      onClick={logIn}
    >
      Mark As Completed <BiCheckboxChecked />
    </Button>
  );
};

export { ResourceCompletionTriggerContainer };
