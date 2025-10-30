import { getAPI } from "api-4markdown";
import {
  API4MarkdownPayload,
  CommentId,
  RatingCategory,
} from "api-4markdown-contracts";
import { getResourceCommentsStoreMeta } from "../store";

const rateResourceCommentAct = async (
  category: RatingCategory,
  commentId: CommentId,
): Promise<void> => {
  try {
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
