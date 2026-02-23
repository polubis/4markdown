import { API4MarkdownPayload } from "api-4markdown-contracts";
import { getAPI, parseError, setCache } from "api-4markdown";
import { AsyncResult } from "development-kit/utility-types";
import { useResourcesLikeState } from "../store";
import { okResourcesLikeSelector } from "../store/selectors";

const toggleResourceLikeAct = async (
  payload: API4MarkdownPayload<"setUserResourceLike">,
): AsyncResult => {
  try {
    const like = await getAPI().call("setUserResourceLike")(payload);

    const currentLikes = {
      ...okResourcesLikeSelector(useResourcesLikeState.get()).data,
    };

    if (like) {
      const newLikes = {
        ...currentLikes,
        [payload.resourceId]: like,
      };

      useResourcesLikeState.swap({
        is: `ok`,
        data: newLikes,
      });

      setCache("getUserResourceLikes", newLikes);

      return { is: `ok` };
    }

    const { [payload.resourceId]: likeToRemove, ...newLikes } = currentLikes;

    useResourcesLikeState.swap({
      is: `ok`,
      data: newLikes,
    });

    setCache("getUserResourceLikes", newLikes);

    return { is: `ok` };
  } catch (error) {
    return {
      is: `fail`,
      error: parseError(error),
    };
  }
};

export { toggleResourceLikeAct };
