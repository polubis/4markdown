import type { CommentId, ResourceId, ResourceType } from "../../domain/models";
import {
  editDocumentComment,
  editMindmapNodeComment,
  formatCommentUpdatedAt,
  toOperationError,
} from "../../integration/api";
import { type Bus } from "../bus";
import { type Store } from "../store";

const saveComment = async (
  resourceId: ResourceId,
  resourceType: ResourceType,
  commentId: CommentId,
  content: string,
) => {
  switch (resourceType) {
    case "document":
      return editDocumentComment(resourceId, commentId, content);
    case "mindmap-node":
      return editMindmapNodeComment(resourceId, commentId, content);
    case "user-profile":
      throw new Error(`Unsupported resource type: ${resourceType}`);
    case "mindmap":
      throw new Error(`Unsupported resource type: ${resourceType}`);
  }
};

export const editComment =
  (store: Store, bus: Bus) =>
  async (commentId: CommentId, content: string) => {
    const { comments, resourceId, resouceType } = store.getState();
    const trimmedContent = content.trim();
    const prevData = comments.data;

    if (!prevData.some((item) => item.id === commentId)) {
      return;
    }

    store.setState({
      comments: {
        ...comments,
        data: comments.data.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content: trimmedContent,
                updatedAt: formatCommentUpdatedAt(new Date().toISOString()),
              }
            : comment,
        ),
      },
    });

    try {
      const updated = await saveComment(
        resourceId,
        resouceType,
        commentId,
        trimmedContent,
      );
      const current = store.getState().comments;

      if (!current.data.some((item) => item.id === commentId)) {
        return;
      }

      store.setState({
        comments: {
          ...current,
          data: current.data.map((comment) =>
            comment.id === commentId ? updated : comment,
          ),
        },
      });
    } catch (error) {
      store.setState({
        comments: {
          ...store.getState().comments,
          data: prevData,
        },
      });
      bus.next({ type: "fail", message: toOperationError(error) });
    }
  };
