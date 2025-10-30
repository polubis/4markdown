import { getAPI, parseError } from "api-4markdown";
import {
  getResourceCommentsStoreMeta,
  useResourceCommentsStore,
} from "../store";
import { API4MarkdownPayload } from "api-4markdown-contracts";

const loadResourceCommentsAct = async (): Promise<void> => {
  try {
    useResourceCommentsStore.setState({
      idle: false,
      loading: true,
      error: null,
    });

    const payload: API4MarkdownPayload<"getResourceComments"> = {
      ...getResourceCommentsStoreMeta(),
      limit: 10,
      nextCursor: useResourceCommentsStore.getState().nextCursor,
    };

    if (!payload.parentId) {
      Reflect.deleteProperty(payload, "parentId");
    }

    const response = await getAPI().call("getResourceComments")(payload);
    useResourceCommentsStore.setState({
      comments: response.comments,
      loading: false,
      nextCursor: response.nextCursor,
      hasMore: response.hasMore,
    });
  } catch (error) {
    useResourceCommentsStore.setState({
      loading: false,
      error: parseError(error),
    });
  }
};

export { loadResourceCommentsAct };
