import React from "react";
import { useAuthStore } from "store/auth/auth.store";
import { toggleResourceLikeAct } from "../acts/toggle-resource-like.act";
import { logInAct } from "acts/log-in.act";
import {
  SetUserResourceLikeItem,
  SetUserResourceLikePayloadWithoutLiked,
} from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";
import { useResourceLike } from "./use-is-resource-liked";

export type { SetUserResourceLikePayloadWithoutLiked };

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
        } as SetUserResourceLikeItem),
      );
    } else {
      logInAct();
    }
  }, [payload, like]);

  return [state, like, toggle] as const;
};

export { useResourceLikeToggle };
