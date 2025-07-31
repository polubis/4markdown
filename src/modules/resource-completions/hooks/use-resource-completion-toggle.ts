import React from "react";
import { useAuthStore } from "store/auth/auth.store";
import { toggleResourceCompletionAct } from "../acts/toggle-resource-completion.act";
import { logIn } from "actions/log-in.action";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";
import { useResourceCompletion } from "./use-is-resource-completed";

const useResourceCompletionToggle = (
  payload: API4MarkdownPayload<"setUserResourceCompletion">,
) => {
  const [state, setState] = React.useState<Transaction>({
    is: `idle`,
  });

  const completion = useResourceCompletion(payload.resourceId);

  const toggle = React.useCallback(async () => {
    const authStore = useAuthStore.getState();

    if (authStore.is === "authorized") {
      setState({ is: `busy` });
      setState(await toggleResourceCompletionAct(payload));
    } else {
      logIn();
    }
  }, [payload]);

  return [state, completion, toggle] as const;
};

export { useResourceCompletionToggle };
