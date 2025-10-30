import { getAPI } from "api-4markdown";
import {
  API4MarkdownPayload,
  CommentId,
  RatingCategory,
} from "api-4markdown-contracts";
import {
  getResourceCommentsStoreMeta,
  useResourceCommentsStore,
} from "../store";

const rateResourceCommentAct = async (
  category: RatingCategory,
  commentId: CommentId,
): Promise<void> => {
  try {
    useResourceCommentsStore.setState({
      comments: useResourceCommentsStore
        .getState()
        .comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, rated: true, [category]: comment[category] + 1 }
            : comment,
        ),
    });

    const payload: API4MarkdownPayload<"rateResourceComment"> = {
      ...getResourceCommentsStoreMeta(),
      commentId,
      category,
    };

    if (!payload.parentId) {
      Reflect.deleteProperty(payload, "parentId");
    }

    await getAPI().call("rateResourceComment")(payload);
  } catch {}
};

export { rateResourceCommentAct };
