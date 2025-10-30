import { getAPI, parseError } from "api-4markdown";
import {
  getResourceCommentsStoreMeta,
  useResourceCommentsStore,
} from "../store";
import { API4MarkdownPayload } from "api-4markdown-contracts";

const deleteResourceCommentAct = async (): Promise<void> => {
  try {
    const commentId = useResourceCommentsStore.getState().deleteCommentData?.id;

    if (!commentId) {
      throw new Error("Comment ID not set");
    }

    useResourceCommentsStore.setState({
      busy: true,
      operationError: null,
    });

    const payload: API4MarkdownPayload<"deleteResourceComment"> = {
      ...getResourceCommentsStoreMeta(),
      commentId,
    };

    if (!payload.parentId) {
      Reflect.deleteProperty(payload, "parentId");
    }

    await getAPI().call("deleteResourceComment")(payload);

    useResourceCommentsStore.setState({
      busy: false,
      comments: useResourceCommentsStore
        .getState()
        .comments.filter((comment) => comment.id !== commentId),
      deleteCommentData: null,
    });
  } catch (error) {
    useResourceCommentsStore.setState({
      busy: false,
      operationError: parseError(error),
    });
  }
};

export { deleteResourceCommentAct };
