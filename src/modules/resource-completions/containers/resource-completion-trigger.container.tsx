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

const CHANGE_COMPLETION_KEY = `change-completion`;

const TriggerContainer = ({
  className,
  ...payload
}: ResourceCompletionTriggerContainerProps) => {
  const completions = useResourcesCompletionState();
  const [completionChange, setCompletionChange] = React.useState<Transaction>({
    is: `idle`,
  });
  const authStore = useAuthStore();

  const triggerToggleCompletion = async () => {
    setCompletionChange({ is: `busy` });
    setCompletionChange(await toggleResourceCompletionAct(payload));
  };

  React.useEffect(() => {
    if (
      authStore.is === "authorized" &&
      localStorage.getItem(CHANGE_COMPLETION_KEY) === `1`
    ) {
      localStorage.removeItem(CHANGE_COMPLETION_KEY);
      toggleResourceCompletionAct(payload);
    }
  }, [authStore]);

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
      {completionChange.is === "fail" ? (
        <>
          <BiError /> Ups, Change Failed
        </>
      ) : (
        <>
          {completions.data[payload.resourceId] ? (
            <>
              Mark As Uncompleted <BiCheckboxMinus />
            </>
          ) : (
            <>
              Mark As Completed <BiCheckboxChecked />
            </>
          )}
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

  const triggerLoginWithCompletionChange = () => {
    localStorage.setItem(CHANGE_COMPLETION_KEY, `1`);
    logIn();
  };

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
      onClick={triggerLoginWithCompletionChange}
    >
      Mark As Completed <BiCheckboxChecked />
    </Button>
  );
};

export { ResourceCompletionTriggerContainer };
