import { getAPI, parseError, setCache } from "api-4markdown";
import type { API4MarkdownContractKey } from "api-4markdown-contracts";
import { useResourcesLikeState } from "../store";

const reloadResourceLikesAct = async (): Promise<void> => {
  try {
    const key: API4MarkdownContractKey = `getUserResourceLikes`;

    useResourcesLikeState.swap({ is: `busy` });

    const likes = await getAPI().call(key)();

    useResourcesLikeState.swap({
      is: `ok`,
      data: likes,
    });

    setCache(key, likes);
  } catch (error: unknown) {
    useResourcesLikeState.swap({
      is: `fail`,
      error: parseError(error),
    });
  }
};

export { reloadResourceLikesAct };
