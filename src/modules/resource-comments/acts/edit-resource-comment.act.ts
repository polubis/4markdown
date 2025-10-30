import { getAPI, parseError } from "api-4markdown";
import { getResourceCommentsStoreMeta } from "../store";
import { useResourceCommentsStore } from "../store";
import { API4MarkdownPayload } from "api-4markdown-contracts";

const editResourceCommentAct = async (content: string): Promise<void> => {
  try {
    const editData = useResourceCommentsStore.getState().commentFormData?.data;

    if (!editData) {
      throw new Error("Edit data not set");
    }

    useResourceCommentsStore.setState({
      busy: true,
      operationError: null,
    });

    const payload: API4MarkdownPayload<"editResourceComment"> = {
      ...getResourceCommentsStoreMeta(),
      etag: editData.etag,
      commentId: editData.id,
      content,
    };

    if (!payload.parentId) {
      Reflect.deleteProperty(payload, "parentId");
    }

    const updatedComment = await getAPI().call("editResourceComment")(payload);

    useResourceCommentsStore.setState({
      busy: false,
      comments: useResourceCommentsStore
        .getState()
        .comments.map((comment) =>
          comment.id === editData.id ? updatedComment : comment,
        ),
      commentFormData: null,
    });
  } catch (error) {
    useResourceCommentsStore.setState({
      busy: false,
      operationError: parseError(error),
    });
  }
};

export { editResourceCommentAct };
