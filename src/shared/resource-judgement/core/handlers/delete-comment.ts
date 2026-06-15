import type { CommentId } from "../../domain/models";
import {
  deleteComment as deleteCommentApi,
  toOperationError,
} from "../../integration/api";
import { isOptimisticCommentId } from "../../domain/value-objects";
import { type Bus } from "../bus";
import { type Store } from "../store";

export const deleteComment =
  (store: Store, bus: Bus) =>
  async (commentId: CommentId) => {
    const { comments } = store.getState();
    const comment = comments.data.find((item) => item.id === commentId);

    if (!comment) {
      return;
    }

    const prevData = comments.data;
    const prevTotalCount = comments.totalCount;

    store.setState({
      comments: {
        ...comments,
        data: comments.data.filter((item) => item.id !== commentId),
        totalCount: Math.max(0, comments.totalCount - 1),
      },
    });

    if (isOptimisticCommentId(commentId)) {
      return;
    }

    try {
      await deleteCommentApi(store.getState().resourceId, commentId);
    } catch (error) {
      store.setState({
        comments: {
          ...store.getState().comments,
          data: prevData,
          totalCount: prevTotalCount,
        },
      });
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
