import React from "react";
import { useAuthStore } from "store/auth/auth.store";
import { toggleResourceLikeAct } from "../acts/toggle-resource-like.act";
import { logInAct } from "acts/log-in.act";
import { API4MarkdownPayload } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";
import { useResourceLike } from "./use-is-resource-liked";

/** Payload without `liked`; the hook sends current like status when toggling. */
export type SetUserResourceLikePayloadWithoutLiked = Omit<
  API4MarkdownPayload<"setUserResourceLike">,
  "liked"
>;

const useResourceLikeToggle = (
  payload: SetUserResourceLikePayloadWithoutLiked,
) => {
  const [state, setState] = React.useState<Transaction>({
    is: `idle`,
  });

  const like = useResourceLike(payload.resourceId);

  const toggle = React.useCallback(async () => {
    const authStore = useAuthStore.getState();

    if (authStore.is === "authorized") {
      setState({ is: `busy` });
      setState(
        await toggleResourceLikeAct({
          ...payload,
          liked: !like,
        }),
      );
    } else {
      logInAct();
    }
  }, [payload, like]);

  return [state, like, toggle] as const;
};

export { useResourceLikeToggle };
