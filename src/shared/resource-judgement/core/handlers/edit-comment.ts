import type { CommentId } from "../../domain/models";
import {
  editComment as editCommentApi,
  toOperationError,
} from "../../integration/api";
import { type Bus } from "../bus";
import { type Store } from "../store";

export const editComment =
  (store: Store, bus: Bus) =>
  async (commentId: CommentId, content: string) => {
    const { comments, resourceId } = store.getState();

    try {
      const updated = await editCommentApi(resourceId, commentId, content);

      store.setState({
        comments: {
          ...comments,
          data: comments.data.map((comment) =>
            comment.id === commentId ? updated : comment,
          ),
        },
      });
    } catch (error) {
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
