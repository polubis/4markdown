import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import { useResourcesLikeState } from "../store";
import { API4MarkdownContractKey, Atoms } from "api-4markdown-contracts";
import { mock } from "development-kit/mock";

const loadResourceLikesAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getUserResourceLikes`;

    const cachedLikes = getCache(key);

    if (cachedLikes !== null) {
      useResourcesLikeState.swap({
        is: `ok`,
        data: cachedLikes,
      });
      return;
    }

    useResourcesLikeState.swap({ is: `busy` });

    // Mock implementation using development-kit/mock utility
    const mockLikes: Record<Atoms["ResourceId"], never> = {};
    const mockCall = mock({ delay: 0.5 })(mockLikes);
    const likes = await mockCall(undefined as never);

    // Original API call implementation (commented out)
    // const likes = await getAPI().call(key)();

    useResourcesLikeState.swap({
      is: `ok`,
      data: likes,
    });

    setCache(key, likes);
  } catch (error) {
    useResourcesLikeState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { loadResourceLikesAct };
