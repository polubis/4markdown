import type { CommentId, ResourceId, ResourceType } from "../../domain/models";
import {
  deleteDocumentComment,
  deleteMindmapNodeComment,
  toOperationError,
} from "../../integration/api";
import { isOptimisticCommentId } from "../../domain/value-objects";
import { type Bus } from "../bus";
import { type Store } from "../store";

const removeComment = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  commentId: CommentId,
) => {
  switch (resourceType) {
    case "document":
      return deleteDocumentComment(resourceId, commentId);
    case "mindmap-node":
      return deleteMindmapNodeComment(resourceId, commentId);
    case "user-profile":
      throw new Error(`Unsupported resource type: ${resourceType}`);
    case "mindmap":
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

export const deleteComment =
  (store: Store, bus: Bus) => async (commentId: CommentId) => {
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
      const { resourceId, resourceType } = store.getState();
      await removeComment(resourceId, resourceType, commentId);
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
