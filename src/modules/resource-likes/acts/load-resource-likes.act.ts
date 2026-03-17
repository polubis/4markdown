import { getAPI, getCache, parseError, setCache } from "api-4markdown";
import { useResourcesLikeState } from "../store";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";

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

    const likes = await getAPI().call(key)();

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
