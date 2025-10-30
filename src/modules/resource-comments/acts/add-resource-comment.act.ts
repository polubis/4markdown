import { getAPI, parseError } from "api-4markdown";
import {
  getResourceCommentsStoreMeta,
  useResourceCommentsStore,
} from "../store";
import { API4MarkdownPayload } from "api-4markdown-contracts";

const addResourceCommentAct = async (content: string): Promise<void> => {
  try {
    useResourceCommentsStore.setState({
      busy: true,
      operationError: null,
    });

    const payload: API4MarkdownPayload<"addResourceComment"> = {
      ...getResourceCommentsStoreMeta(),
      comment: content,
    };

    if (!payload.parentId) {
      Reflect.deleteProperty(payload, "parentId");
    }

    const updatedComment = await getAPI().call("addResourceComment")(payload);
    useResourceCommentsStore.setState({
      busy: false,
      comments: [
        ...useResourceCommentsStore.getState().comments,
        updatedComment,
      ],
      commentFormData: null,
    });
  } catch (error) {
    useResourceCommentsStore.setState({
      busy: false,
      operationError: parseError(error),
    });
  }
};

export { addResourceCommentAct };
