import { API4MarkdownPayload, ResourceLikeDto } from "api-4markdown-contracts";
import { getAPI, parseError, setCache } from "api-4markdown";
import { AsyncResult } from "development-kit/utility-types";
import { useResourcesLikeState } from "../store";
import { okResourcesLikeSelector } from "../store/selectors";
import { mock } from "development-kit/mock";

const toggleResourceLikeAct = async (
  payload: API4MarkdownPayload<"setUserResourceLike">,
): AsyncResult => {
  try {
    // Mock implementation using development-kit/mock utility
    const currentLikesBeforeToggle = okResourcesLikeSelector(
      useResourcesLikeState.get(),
    ).data;
    const isCurrentlyLiked = !!currentLikesBeforeToggle[payload.resourceId];

    const mockLike: ResourceLikeDto | null = isCurrentlyLiked
      ? null
      : {
          cdate: new Date().toISOString() as ResourceLikeDto["cdate"],
          type: payload.type,
          resourceId: payload.resourceId,
          parentId: payload.parentId,
        };

    const mockCall = mock({ delay: 0.3 })(mockLike);
    const like = await mockCall(payload);

    // Original API call implementation (commented out)
    // const like = await getAPI().call("setUserResourceLike")(payload);

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
