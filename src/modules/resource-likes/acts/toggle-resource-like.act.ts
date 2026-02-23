import { SetUserResourceLikeItem } from "api-4markdown-contracts";
import { getAPI, parseError, setCache } from "api-4markdown";
import { AsyncResult } from "development-kit/utility-types";
import { useResourcesLikeState } from "../store";
import { okResourcesLikeSelector } from "../store/selectors";

const toggleResourceLikeAct = async (
  payload: SetUserResourceLikeItem,
): AsyncResult => {
  try {
    const results = await getAPI().call("setUserResourceLike")([payload]);
    const result = results[0];
    if (!result) return { is: `ok` };

    const currentLikes = {
      ...okResourcesLikeSelector(useResourcesLikeState.get()).data,
    };

    if (result.removed) {
      const { [payload.resourceId]: _, ...newLikes } = currentLikes;
      useResourcesLikeState.swap({ is: `ok`, data: newLikes });
      setCache("getUserResourceLikes", newLikes);
    } else {
      const { removed: _, ...like } = result;
      const newLikes = { ...currentLikes, [payload.resourceId]: like };
      useResourcesLikeState.swap({ is: `ok`, data: newLikes });
      setCache("getUserResourceLikes", newLikes);
    }

    return { is: `ok` };
  } catch (error) {
    return {
      is: `fail`,
      error: parseError(error),
    };
  }
};

export { toggleResourceLikeAct };
